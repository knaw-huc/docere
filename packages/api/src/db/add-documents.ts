import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import fetch from 'node-fetch'

import { SerializedEntry, XmlDirectoryStructure } from '../../../common/src'

import { isError, getDocumentIdFromRemoteXmlFilePath } from '../utils'
import Puppenv from '../puppenv'

import { getPool, transactionQuery } from './index'
import { indexDocument } from '../es'
import { DocereConfig, ID } from '@docere/common'

type AddRemoteFilesOptions = {
	force?: boolean
	maxPerDir?: number
	maxPerDirOffset?: number
}

const defaultAddRemoteFilesOptions: Required<AddRemoteFilesOptions> = {
	force: false,
	maxPerDir: null,
	maxPerDirOffset: 0,
}

async function xmlExists(fileName: string, content: string, client: PoolClient) {
	const hash = crypto.createHash('md5').update(content)
	const hex = hash.digest('hex')
	const existsResult = await client.query(`SELECT EXISTS(SELECT 1 FROM xml WHERE name='${fileName}' AND hash='${hex}')`)
	return existsResult.rows[0].exists
}

export async function addRemoteFiles(
	remotePath: string,
	projectId: string,
	puppenv: Puppenv,
	projectConfig: DocereConfig,
	options?: AddRemoteFilesOptions
) {
	options = { ...defaultAddRemoteFilesOptions, ...options }
	if (remotePath.charAt(0) === '/') remotePath = remotePath.slice(1)

	// Fetch directory structure
	const xmlEndpoint = `${process.env.DOCERE_XML_URL}/${remotePath}`
	const result = await fetch(xmlEndpoint)
	if (result.status === 404) {
		console.log(`[${projectId}] remote path not found: '${remotePath}'`)
		return
	}
	const dirStructure: XmlDirectoryStructure = await result.json()
	let { files } = dirStructure

	// If the maxPerDir option is set, slice the files
	if (options.maxPerDir != null) {
		const maxPerDirOffset = options.maxPerDirOffset == null ? 0 : options.maxPerDirOffset
		files = files.slice(maxPerDirOffset, maxPerDirOffset + options.maxPerDir)
	}

	// Add every XML file to the database
	for (const filePath of files) {
		const entryId = getDocumentIdFromRemoteXmlFilePath(filePath, remotePath, projectConfig.documents.stripRemoteDirectoryFromDocumentId)
		const result = await fetch(`${process.env.DOCERE_XML_URL}${filePath}`)
		const content = await result.text()	
		await addXmlToDb(content, projectId, entryId, puppenv, options.force)
	}

	// Recursively add sub dirs
	for (const dirPath of dirStructure.directories) {
		await addRemoteFiles(dirPath, projectId, puppenv, projectConfig, options)
	}
}

export async function addXmlToDb(content: string, projectId: string, documentId: string, puppenv: Puppenv, force = false) {
	const pool = await getPool(projectId)
	const client = await pool.connect()
	
	const isUpdate = await xmlExists(documentId, content, client)
	if (isUpdate && !force) {
		console.log(`[${projectId}] document '${documentId}' exists`)
		client.release()
		return
	}

	const prepareAndExtractOutput = await puppenv.prepareAndExtract(content, projectId, documentId)
	if (isError(prepareAndExtractOutput)) {
		// TODO log error
		client.release()
		console.log(prepareAndExtractOutput.__error)
		return
	}
	const [serializedEntry, extractedXml] = prepareAndExtractOutput

	const esClient = new es.Client({ node: 'http://es01:9200' })

	await transactionQuery(client, 'BEGIN')

	const { rows } = await transactionQuery(
		client,
		`INSERT INTO xml
			(name, hash, content, updated)
		VALUES
			($1, md5($2), $2, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			hash=md5($2),
			content=$2,
			updated=NOW()
		RETURNING id;`,
		[documentId, extractedXml.original]
	)
	const xml_id = rows[0].id

	await addDocumentToDb({ client, documentId, xml_id, order_number: null, entry: serializedEntry, content: extractedXml.prepared })
	await indexDocument(projectId, serializedEntry, esClient)

	let i = 0
	for (const part of serializedEntry.parts) {
		await addDocumentToDb({ client, documentId: part.id, xml_id, order_number: i++, entry: part, content: part.content })
		await indexDocument(projectId, part, esClient)
	}

	await transactionQuery(client, 'COMMIT')

	console.log(`[${projectId}] ${isUpdate ? 'Updated' : 'Added'}: '${documentId}'`)

	client.release()
}

async function addDocumentToDb(props: {
	client: PoolClient,
	content: string
	entry: SerializedEntry,
	documentId: ID,
	order_number: number,
	xml_id: ID,
}) {
	const { plainText, parts, content, ...dbEntry } = props.entry

	await transactionQuery(
		props.client,
		`INSERT INTO document
			(name, xml_id, order_number, content, json, updated)
		VALUES
			($1, $2, $3, $4, $5, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			xml_id=$2,
			order_number=$3,
			content=$4,
			json=$5,
			updated=NOW()
		RETURNING id;`,
		[props.documentId, props.xml_id, props.order_number, props.content, JSON.stringify(dbEntry)]
	)
}
