import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import fetch from 'node-fetch'
import { JsonEntry, XmlDirectoryStructure, StandoffTree, createJsonEntry, DocereConfig, ID } from '@docere/common'

import { getDocumentIdFromRemoteFilePath, isError } from '../utils'
import { xml2standoff } from '../utils/xml2standoff'

import { getPool, transactionQuery } from './index'
import { indexDocument } from '../es'
import { XML_SERVER_ENDPOINT } from '../constants'
import { createStandoff } from '../utils/source2entry'

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

	// TODO rename XML_SERVER_ENDPOINT to FILE_SERVER_ENDPOINT
	// Fetch directory structure
	const endpoint = `${XML_SERVER_ENDPOINT}/${remotePath}`
	const result = await fetch(endpoint)
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

	const pool = await getPool(projectConfig.slug)
	const client = await pool.connect()
	const esClient = new es.Client({ node: 'http://es01:9200' })

	// Add every file to the database
	for (const filePath of files) {
		const entryId = getDocumentIdFromRemoteFilePath(filePath, remotePath, projectConfig)
		const result = await fetch(`${XML_SERVER_ENDPOINT}${filePath}`)

		let source: any
		if (projectConfig.documents.type === 'xml') {
			const xml = await result.text()	
			source = await xml2standoff(xml)
		} else {
			source = await result.json()
		}

		await addStandoffToDb(source, projectConfig, entryId, client, esClient, options.force)
	}
	client.release()

	// Recursively add sub dirs
	for (const dirPath of dirStructure.directories) {
		await addRemoteStandoffToDb(dirPath, projectConfig, options)
	}
}

async function addStandoffToDb(
	source: any,
	projectConfig: DocereConfig,
	documentId: string,
	client: PoolClient,
	esClient: es.Client,
	force = false
) {
	
	const isUpdate = await documentExists(documentId, JSON.stringify(source), client)
	if (isUpdate && !force) {
		console.log(`[${projectConfig.slug}] document '${documentId}' exists`)
		return
	}

	const standoff = createStandoff(source, projectConfig)
	const tree = new StandoffTree(standoff, projectConfig.standoff.exportOptions)
	projectConfig.standoff.prepareExport(tree)

	const entry = createJsonEntry({
		config: projectConfig,
		id: documentId,
		tree,
	})

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

	const indexResult = await indexDocument(projectConfig, entry, tree.standoff, esClient)
	if (isError(indexResult)) {
		console.log(indexResult.__error.body.error)
		await transactionQuery(client, 'ABORT')
		console.log(`\n[${projectConfig.slug}] ${isUpdate ? 'Update' : 'Addition'} aborted: '${documentId}'\n`, indexResult.__error)
		return
	}

	// let i = 0
	// for (const part of serializedEntry.parts) {
	// 	await addDocumentToDb({ client, documentId: part.id, xml_id, order_number: i++, entry: part, content: part.content })
	// 	await indexDocument(projectId, part, esClient)
	// }

	await transactionQuery(client, 'COMMIT')

	console.log(`[${projectConfig.slug}] ${isUpdate ? 'Updated' : 'Added'}: '${documentId}'`)
}

/**
 * Add document to DB 
 * 
 * @param props
 */
async function addDocumentToDb(props: {
	client: PoolClient,
	tree: StandoffTree,
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
