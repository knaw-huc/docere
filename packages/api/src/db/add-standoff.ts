import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import fetch from 'node-fetch'
import { JsonEntry, XmlDirectoryStructure, AnnotationTree, createJsonEntry, DocereConfig, ID } from '@docere/common'


import { getDocumentIdFromRemoteFilePath } from '../utils'

import { getPool, transactionQuery } from './index'
import { indexDocument } from '../es'
import { XML_SERVER_ENDPOINT } from '../constants'
import { createDocereAnnotationTree } from '../api/document'

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

async function documentExists(fileName: string, content: string, client: PoolClient) {
	const hash = crypto.createHash('md5').update(content)
	const hex = hash.digest('hex')
	const existsResult = await client.query(`SELECT EXISTS(SELECT 1 FROM source WHERE name='${fileName}' AND hash='${hex}')`)
	return existsResult.rows[0].exists
}

export async function addRemoteStandoffToDb(
	remotePath: string,
	projectConfig: DocereConfig,
	options?: AddRemoteFilesOptions
) {
	options = { ...defaultAddRemoteFilesOptions, ...options }
	if (remotePath.charAt(0) === '/') remotePath = remotePath.slice(1)

	// Fetch directory structure
	const xmlEndpoint = `${XML_SERVER_ENDPOINT}/${remotePath}`
	const result = await fetch(xmlEndpoint)
	if (result.status === 404) {
		console.log(`[${projectConfig.slug}] remote path not found: '${remotePath}'`)
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
		const entryId = getDocumentIdFromRemoteFilePath(filePath, 'json', remotePath, projectConfig.documents.stripRemoteDirectoryFromDocumentId)
		const result = await fetch(`${XML_SERVER_ENDPOINT}${filePath}`)
		const source = await result.json()	
		await addStandoffToDb(source, projectConfig, entryId, options.force)
	}

	// Recursively add sub dirs
	for (const dirPath of dirStructure.directories) {
		await addRemoteStandoffToDb(dirPath, projectConfig, options)
	}
}

async function addStandoffToDb(
	source: any,
	projectConfig: DocereConfig,
	documentId: string,
	force = false
) {
	const pool = await getPool(projectConfig.slug)
	const client = await pool.connect()
	
	const isUpdate = await documentExists(documentId, JSON.stringify(source), client)
	if (isUpdate && !force) {
		console.log(`[${projectConfig.slug}] document '${documentId}' exists`)
		client.release()
		return
	}

	const standoff = projectConfig.standoff.prepareSource(source)
	const tree = createDocereAnnotationTree(standoff, projectConfig)

	const entry = createJsonEntry({
		config: projectConfig,
		id: documentId,
		tree,
	})

	const esClient = new es.Client({ node: 'http://es01:9200' })

	await transactionQuery(client, 'BEGIN')

	const { rows } = await transactionQuery(
		client,
		`INSERT INTO source
			(name, hash, content, standoff, updated)
		VALUES
			($1, md5($2), $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			hash=md5($2),
			content=$2,
			standoff=$3,
			updated=NOW()
		RETURNING id;`,
		[documentId, JSON.stringify(source), JSON.stringify(standoff)]
	)
	const sourceId = rows[0].id

	await addDocumentToDb({ client, documentId, order_number: null, entry, tree, sourceId })
	await indexDocument(projectConfig.slug, entry, tree.getStandoff(), esClient)

	// let i = 0
	// for (const part of serializedEntry.parts) {
	// 	await addDocumentToDb({ client, documentId: part.id, xml_id, order_number: i++, entry: part, content: part.content })
	// 	await indexDocument(projectId, part, esClient)
	// }

	await transactionQuery(client, 'COMMIT')

	console.log(`[${projectConfig.slug}] ${isUpdate ? 'Updated' : 'Added'}: '${documentId}'`)

	client.release()
}

/**
 * Add document to DB 
 * 
 * @param props
 */
async function addDocumentToDb(props: {
	client: PoolClient,
	tree: AnnotationTree,
	documentId: ID,
	entry: JsonEntry,
	order_number: number,
	sourceId: string
}) {
	await transactionQuery(
		props.client,
		`INSERT INTO document
			(name, source_id, order_number, entry, updated)
		VALUES
			($1, $2, $3, $4, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			source_id=$2,
			order_number=$3,
			entry=$4,
			updated=NOW()
		RETURNING id;`,
		[
			props.documentId,
			props.sourceId,
			props.order_number,
			JSON.stringify(props.entry)
		]
	)
}
