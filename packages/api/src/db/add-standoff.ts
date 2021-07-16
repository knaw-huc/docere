import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import fetch from 'node-fetch'
import { CreateJsonEntryProps, JsonEntry, XmlDirectoryStructure, StandoffTree, createJsonEntry, DocereConfig, ID, CreateJsonEntryPartProps } from '@docere/common'

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

/**
 * Fetch source file
 * 
 * The source file can be one of three types: standoff, xml or json
 * 
 * @param filePath 
 * @param projectConfig 
 */
async function fetchSource(filePath: string, projectConfig: DocereConfig) {
	const result = await fetch(`${XML_SERVER_ENDPOINT}${filePath}`)

	let source: any
	if (projectConfig.documents.type === 'xml') {
		source = await result.text()	
	} else {
		source = await result.json()
	}

	if (projectConfig.standoff.prepareSource != null) {
		source = projectConfig.standoff.prepareSource(source)
	} else if (projectConfig.documents.type === 'json') {
		console.log("[xml2standoff] prepareSource can't be empty when the source is of type JSON")
	}

	if (typeof source === 'string') {
		try {
			source = await xml2standoff(source)
		} catch (error) {
			console.log('[xml2standoff]', error)	
		}
	}

	return source
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
		const source = await fetchSource(filePath, projectConfig)
		if (source == null) continue
		const entryId = getDocumentIdFromRemoteFilePath(filePath, remotePath, projectConfig)
		await addSourceToDb(source, projectConfig, entryId, client, esClient, options.force)
	}
	client.release()

	// Recursively add sub dirs
	for (const dirPath of dirStructure.directories) {
		await addRemoteStandoffToDb(dirPath, projectConfig, options)
	}
}

async function addSourceToDb(
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

	const createJsonEntryProps: CreateJsonEntryProps = {
		config: projectConfig,
		id: documentId,
		tree,
	}

	tree.annotations.forEach(a => {
		const entityConfig = projectConfig.entities2.find(ec => ec.filter(a))
		if (entityConfig != null) {
			a.metadata._entityConfigId = entityConfig.id
			a.metadata._entityId = entityConfig.getId(a)
			a.metadata._entityValue = entityConfig.getValue(a, createJsonEntryProps)
		}

		if (projectConfig.facsimiles?.filter(a)) {
			a.metadata._facsimileId = projectConfig.facsimiles.getId(a)
			a.metadata._facsimilePath = projectConfig.facsimiles.getPath(a, createJsonEntryProps)
		}
	})

	const entry = createJsonEntry(createJsonEntryProps)

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

	await addDocumentToDb({ client, documentId, order_number: null, entry, sourceId })

	const indexResult = await indexDocument(entry, createJsonEntryProps, esClient)
	if (isError(indexResult)) {
		await transactionQuery(client, 'ABORT')
		console.log(`\n[${projectConfig.slug}] ${isUpdate ? 'Update' : 'Addition'} aborted: '${documentId}'\n`, indexResult.__error)
		return
	}

	let i = 0
	if (Array.isArray(projectConfig.parts)) {
		for (const partConfig of projectConfig.parts) {
			for (const root of tree.annotations.filter(partConfig.filter).slice(0, 10)) {
				const createJsonEntryPartProps: CreateJsonEntryPartProps = {
					config: projectConfig,
					id: partConfig.getId(root),
					partConfig,
					root,
					sourceProps: createJsonEntryProps,
				}

				const entry = createJsonEntry(createJsonEntryPartProps)
				await addDocumentToDb({
					client,
					documentId: entry.id,
					entry,
					order_number: i++,
					sourceId,
				})

				const indexResult = await indexDocument(entry, createJsonEntryProps, esClient)
				if (isError(indexResult)) {
					await transactionQuery(client, 'ABORT')
					console.log(`Index ${partConfig.id}: ${entry.id} aborted`, indexResult)
					return
				}

				console.log(`[${projectConfig.slug}] Added ${partConfig.id}: '${entry.id}'`)
			}
		}
	}

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
