import * as es from '@elastic/elasticsearch'
import { DocereConfig, getEntriesFromSource, PartialStandoff } from '@docere/common'

import { getSourceIdFromRemoteFilePath } from './get-source-id-from-file-path'
import { isError } from '../../utils'
import { fetchAndPrepareSource } from './fetch-source'
import { fetchRemotePaths } from './fetch-remote-paths'
import { DocereDB } from '../docere-db'

import { indexDocument } from '../../es'

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
	db: DocereDB,
	esClient: es.Client
) {
	const [files, directories] = await fetchRemotePaths(remotePath, projectConfig, options)

	// Add every file to the database
	for (const filePath of files) {
		const source = await fetchAndPrepareSource(filePath, projectConfig)
		if (source == null) continue
		const sourceId = getSourceIdFromRemoteFilePath(filePath, projectConfig)
		await handleSource(source, projectConfig, sourceId, db, esClient, options.force)
	}

	// Recursively add sub dirs
	for (const dirPath of directories) {
		await addFilesFromRemoteDir(dirPath, projectConfig, options, db, esClient)
	}
}

export async function addRemoteStandoffToDb(
	remotePath: string,
	projectConfig: DocereConfig,
	options?: AddRemoteFilesOptions
) {
	options = { ...defaultAddRemoteFilesOptions, ...options }

	// Init database and search index clients
	const db = await new DocereDB(projectConfig.slug).init()
	const esClient = new es.Client({ node: process.env.DOCERE_SEARCH_URL })

	// Recursively add source files to db
	await addFilesFromRemoteDir(remotePath, projectConfig, options, db, esClient)

	db.release()
}

export async function handleSource(
	source: PartialStandoff,
	projectConfig: DocereConfig,
	sourceId: string,
	db: DocereDB,
	esClient: es.Client,
	force = false
) {
	const stringifiedSource = JSON.stringify(source)

	const isUpdate = await db.sourceExists(sourceId, stringifiedSource)
	if (isUpdate && !force) {
		console.log(`[${projectConfig.slug}] document '${sourceId}' exists`)
		return
	} else if (isUpdate) {
		await db.deleteEntriesFromSource(sourceId)
	}

 	// const partialStandoff = await prepareSource(source, projectConfig)
	const entries = await getEntriesFromSource(sourceId, source, projectConfig)

	await db.begin()

	const insertSourceResult = await db.insertSource(
		sourceId, 
		stringifiedSource,
	)
	if (isError(insertSourceResult)) return

	const sourceRowId = insertSourceResult.rows[0].id

	for (const entry of entries) {
		const insertEntryResult = await db.insertEntry(entry, sourceRowId)

		if (isError(insertEntryResult)) {
			await db.rollback('__TODO__', insertEntryResult.__error)
			return
		}

		const partId = entry.partId == null ? '' : ` part '${entry.partId}'`

		const indexResult = await indexDocument(entry, projectConfig, esClient)
		if (isError(indexResult)) {
			await db.rollback('__TODO__', indexResult.__error)
			console.log(`Index${partId}: ${entry.id} aborted`, indexResult)
			console.log('RETURNING')
			return
		}

		console.log(`[${projectConfig.slug}] ${isUpdate ? 'Updated' : 'Added'}${partId}: '${entry.id}'`)
	}

	await db.commit()

	return sourceRowId
}
