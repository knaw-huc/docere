import crypto from 'crypto'
import * as es from '@elastic/elasticsearch'
import { PoolClient } from 'pg'
import { StandoffTree, DocereConfig, PartialStandoff, GetValueProps } from '@docere/common'

import { getDocumentIdFromRemoteFilePath } from '../../utils'
import { fetchSource } from './fetch-source'
import { fetchRemotePaths } from './fetch-remote-paths'

import { getPool, transactionQuery } from '../index'
import { createStandoff } from '../../utils/source2entry'

import { addDocument } from './add-document'

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

function getHash(content: string) {
	const hash = crypto.createHash('md5').update(content)
	const hex = hash.digest('hex')
	return hex
}

async function documentExists(fileName: string, content: string, client: PoolClient) {
	const hash = getHash(content)
	console.log('Document exists? ', hash)
	const existsResult = await client.query(`SELECT EXISTS(SELECT 1 FROM source WHERE name='${fileName}' AND hash='${hash}')`)
	return existsResult.rows[0].exists
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
		await addSourceToDb(source, projectConfig, entryId, client, esClient, options.force)
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

async function addSourceToDb(
	source: PartialStandoff,
	projectConfig: DocereConfig,
	documentId: string,
	client: PoolClient,
	esClient: es.Client,
	force = false
) {
	const stringifiedSource = JSON.stringify(source)
	const isUpdate = await documentExists(documentId, stringifiedSource, client)
	if (isUpdate && !force) {
		console.log(`[${projectConfig.slug}] document '${documentId}' exists`)
		return
	}

	const standoff = createStandoff(source, projectConfig)
	const sourceTree = new StandoffTree(standoff, projectConfig.standoff.exportOptions)

	// TODO remove createJsonEntryProps here, add entity value somewhere else
	const getValueProps: GetValueProps = {
		config: projectConfig,
		id: documentId,
		tree: sourceTree,
	}

	sourceTree.annotations.forEach(a => {
		const entityConfig = projectConfig.entities2.find(ec => ec.filter(a))
		if (entityConfig != null) {
			a.metadata._entityConfigId = entityConfig.id
			a.metadata._entityId = entityConfig.getId(a)
			a.metadata._entityValue = entityConfig.getValue(a, getValueProps)
		}

		if (projectConfig.facsimiles?.filter(a)) {
			a.metadata._facsimileId = projectConfig.facsimiles.getId(a)
			a.metadata._facsimilePath = projectConfig.facsimiles.getPath(a, getValueProps)
		}
	})

	// const entry = createJsonEntry(createJsonEntryProps)

	await transactionQuery(client, 'BEGIN')

	const { rows } = await transactionQuery(
		client,
		`INSERT INTO source
			(name, hash, content, standoff, updated)
		VALUES
			($1, md5($2), $2, $3, NOW())
		ON CONFLICT (name) DO UPDATE
		SET
			hash=$2,
			content=$3,
			standoff=$4,
			updated=NOW()
		RETURNING id;`,
		[documentId, getHash(stringifiedSource), stringifiedSource, JSON.stringify(standoff)]
	)
	const sourceId = rows[0].id

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
					documentId

				await addDocument({
					client,
					esClient,
					id,
					isUpdate,
					partConfig,
					projectConfig,
					root,
					sourceId,
					sourceTree,
				})
			}
		}
	} else {
		await addDocument({
			client,
			esClient,
			id: documentId,
			isUpdate,
			projectConfig,
			root: sourceTree.root,
			sourceId,
			sourceTree,
		})
	}

	await transactionQuery(client, 'COMMIT')
}

