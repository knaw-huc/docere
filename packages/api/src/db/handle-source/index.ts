import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import { DocereConfig, getEntriesFromSource } from '@docere/common'

import { getDocumentIdFromRemoteFilePath } from '../../utils'
import { fetchSource } from './fetch-source'
import { fetchRemotePaths } from './fetch-remote-paths'

import { DB, getPool, transactionQuery } from '../index'

import { handleEntry } from './handle-entry'

export type AddRemoteFilesOptions = {
	force?: boolean
	maxPerDir?: number
	maxPerDirOffset?: number
}

const defaultAddRemoteFilesOptions: Required<AddRemoteFilesOptions> = {
	force: false,
	maxPerDir: null,
	maxPerDirOffset: 0,
}

export function getHash(content: string) {
	const hash = crypto.createHash('md5').update(content)
	const hex = hash.digest('hex')
	return hex
}

/**
 * Handle source files from a directory.
 * 
 * The function works recursively, for each directory the function is called
 * 
 * @param remotePath 
 * @param projectConfig 
 * @param options 
 * @param client 
 * @param esClient 
 */
async function addFilesFromRemoteDir(
	remotePath: string,
	projectConfig: DocereConfig,
	options: AddRemoteFilesOptions,
	client: PoolClient,
	esClient: es.Client
) {
	const [files, directories] = await fetchRemotePaths(remotePath, projectConfig, options)

	// Add every file to the database
	for (const filePath of files) {
		const source = await fetchSource(filePath, projectConfig)
		if (source == null) continue
		const entryId = getDocumentIdFromRemoteFilePath(filePath, remotePath, projectConfig)
		await handleSource(source, projectConfig, entryId, client, esClient, options.force)
	}

	// Recursively add sub dirs
	for (const dirPath of directories) {
		await addFilesFromRemoteDir(dirPath, projectConfig, options, client, esClient)
	}
}

export async function addRemoteStandoffToDb(
	remotePath: string,
	projectConfig: DocereConfig,
	options?: AddRemoteFilesOptions
) {
	options = { ...defaultAddRemoteFilesOptions, ...options }

	// Init database and search index clients
	const pool = await getPool(projectConfig.slug)
	const client = await pool.connect()
	const esClient = new es.Client({ node: process.env.DOCERE_SEARCH_URL })

	// Recursively add source files to db
	await addFilesFromRemoteDir(remotePath, projectConfig, options, client, esClient)

	client.release()
}

export async function handleSource(
	source: string | object,
	projectConfig: DocereConfig,
	sourceId: string,
	client: PoolClient,
	esClient: es.Client,
	force = false
) {
	const stringifiedSource = typeof source === 'string' ?
		source :
		JSON.stringify(source)

	const isUpdate = await DB.sourceExists(sourceId, stringifiedSource, client)
	if (isUpdate && !force) {
		console.log(`[${projectConfig.slug}] document '${sourceId}' exists`)
		return
	} else if (isUpdate) {
		await DB.deleteEntriesFromSource(sourceId, client)
	}

	const entries = getEntriesFromSource(sourceId, source, projectConfig)

	await transactionQuery(client, 'BEGIN')

	const sourceRowId = await DB.insertSource({
		client,
		id: sourceId, 
		stringifiedSource,
	})

	// if (Array.isArray(projectConfig.parts)) {
	// 	for (const partConfig of projectConfig.parts) {
	// 		// If partConfig.filter is defined, use it it get the roots,
	// 		// if no filter is defined, use the root of the tree
	// 		const roots = partConfig.filter != null ?
	// 			sourceTree.annotations.filter(partConfig.filter).slice(0, 10) :
	// 			[sourceTree.root]

	// 		for (const root of roots) {
	// 			const id = partConfig.getId != null ?
	// 				partConfig.getId(root) :
	// 				sourceId

	// 			await handleEntry({
	// 				client,
	// 				esClient,
	// 				isUpdate,
	// 				entry,
	// 				// props: {
	// 				// 	id,
	// 				// 	partConfig,
	// 				// 	projectConfig,
	// 				// 	root,
	// 				// 	sourceId: sourceRowId,
	// 				// 	sourceTree,
	// 				// }
	// 			})
	// 		}
	// 	}
	// } else {
	// 	await handleEntry({
	// 		client,
	// 		esClient,
	// 		isUpdate,
	// 		entry,
	// 		// props: {
	// 		// 	id: sourceId,
	// 		// 	projectConfig,
	// 		// 	sourceId: sourceRowId,
	// 		// 	sourceTree,
	// 		// }
	// 	})
	// }

	await transactionQuery(client, 'COMMIT')

	return sourceRowId
}
