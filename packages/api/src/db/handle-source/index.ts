import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import { StandoffTree, DocereConfig, PartialStandoff, GetValueProps } from '@docere/common'

import { getDocumentIdFromRemoteFilePath } from '../../utils'
import { fetchSource } from './fetch-source'
import { fetchRemotePaths } from './fetch-remote-paths'

import { DB, getPool, transactionQuery } from '../index'
import { createStandoff } from '../../utils/source2entry'

import { handleEntry } from './handle-entry'
import { xml2standoff } from '../../utils/xml2standoff'

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

	const partialStandoff = await prepareSource(source, projectConfig)

	const isUpdate = await DB.sourceExists(sourceId, stringifiedSource, client)
	if (isUpdate && !force) {
		console.log(`[${projectConfig.slug}] document '${sourceId}' exists`)
		return
	} else if (isUpdate) {
		await client.query(`DELETE FROM document USING source WHERE source.name='${sourceId}' AND source.id=document.source_id`)
	}

	const standoff = createStandoff(partialStandoff, projectConfig)
	const sourceTree = new StandoffTree(standoff, projectConfig.standoff.exportOptions)

	sourceTree.annotations.forEach(annotation => {
		const props: GetValueProps = {
			annotation,
			projectConfig,
			sourceId,
			sourceTree,
		}

		const entityConfig = projectConfig.entities2.find(ec => ec.filter(annotation))
		if (entityConfig != null) {
			annotation.metadata._entityConfigId = entityConfig.id
			annotation.metadata._entityId = entityConfig.getId(annotation)
			annotation.metadata._entityValue = entityConfig.getValue(props)
		}

		if (projectConfig.facsimiles?.filter(annotation)) {
			annotation.metadata._facsimileId = projectConfig.facsimiles.getId(annotation)
			annotation.metadata._facsimilePath = projectConfig.facsimiles.getPath(props)
		}
	})

	await transactionQuery(client, 'BEGIN')

	const sourceRowId = await DB.insertSource({
		client,
		id: sourceId, 
		stringifiedSource,
		standoff
	})

	if (Array.isArray(projectConfig.parts)) {
		for (const partConfig of projectConfig.parts) {
			// If partConfig.filter is defined, use it it get the roots,
			// if no filter is defined, use the root of the tree
			const roots = partConfig.filter != null ?
				sourceTree.annotations.filter(partConfig.filter).slice(0, 10) :
				[sourceTree.root]

			for (const root of roots) {
				const id = partConfig.getId != null ?
					partConfig.getId(root) :
					sourceId

				await handleEntry({
					client,
					esClient,
					isUpdate,
					props: {
						id,
						partConfig,
						projectConfig,
						root,
						sourceId: sourceRowId,
						sourceTree,
					}
				})
			}
		}
	} else {
		await handleEntry({
			client,
			esClient,
			isUpdate,
			props: {
				id: sourceId,
				projectConfig,
				sourceId: sourceRowId,
				sourceTree,
			}
		})
	}

	await transactionQuery(client, 'COMMIT')

	return sourceRowId
}

/**
 * Prepare source for further processing.
 * 
 * The source can be XML (string) or JSON (either some arbitrary JSON or
 * (partial) Standoff). The string or JSON can be preprocessed by the 
 * {@link DocereConfig.standoff.prepareSource} function. If the source is
 * a (XML) string, it is converted PartialStandoff
 * 
 * @param source 
 * @param projectConfig 
 * @returns 
 */
async function prepareSource(
	source: string | object,
	projectConfig: DocereConfig
): Promise<PartialStandoff> {
	let preparedSource: PartialStandoff | string

	if (projectConfig.standoff.prepareSource != null) {
		preparedSource = projectConfig.standoff.prepareSource(source)
	} else if (projectConfig.documents.type === 'json') {
		throw new Error("[xml2standoff] prepareSource can't be empty when the source is of type JSON")
	}

	let partialStandoff: PartialStandoff
	if (typeof preparedSource === 'string') {
		try {
			partialStandoff = await xml2standoff(preparedSource)
		} catch (error) {
			console.log('[xml2standoff]', error)	
			return
		}
	} else {
		partialStandoff = preparedSource
	}

	return partialStandoff
}
