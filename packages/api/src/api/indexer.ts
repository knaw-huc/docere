import { Express } from 'express'
import * as es from '@elastic/elasticsearch'

import Puppenv from '../puppenv'
import { send, listProjects, readFileContents, getEntryIdFromFilePath, getElasticSearchDocument, isError, getXmlFiles } from '../utils'
import type { ElasticSearchDocument, DocereApiError } from '../types'

async function indexDocument(filePath: string, projectId: string, puppenv: Puppenv, esClient: es.Client) {
	const xml = readFileContents(filePath)
	const documentId = getEntryIdFromFilePath(filePath, projectId)
	const x = await puppenv.prepareAndExtract(xml, projectId, documentId)
	const esDocument = getElasticSearchDocument(x)
	if (isError(esDocument)) return esDocument

	try {
		await esClient.index({
			index: projectId,
			body: esDocument,
		})
		return esDocument
	} catch (err) {
		return { __error: err }
	}
}

async function indexProject(projectId: string, puppenv: Puppenv, esClient: es.Client, state: IndexerState, maxPerDir: number) {
	const filePaths = await getXmlFiles(projectId, maxPerDir)

	// Check if any files are found
	if (!filePaths.length) {
		state.set(projectId, {
			...state.get(projectId),
			document: { __error: 'No files found' },
			documentCount: 0,
		})
		return
	}

	// Get the ElasticSearch mapping for the project
	const mapping = await puppenv.getMapping(projectId, filePaths)
	if (isError(mapping)) {
		state.set(projectId, {
			...state.get(projectId),
			document: mapping,
			documentCount: filePaths.length,
		})
		return
	}

	// Delete the previous index
	try {
		await esClient.indices.delete({ index: projectId })	
	} catch (err) {
		// console.log('deleteIndex', err)	
	}

	// Create a fresh index
	try {
		await esClient.indices.create({
			index: projectId,
			body: mapping
		})	
	} catch (err) {
		console.log('createIndex', err)
	}

	// Insert every XML file one by one
	let index = 0
	for (const filePath of filePaths) {
		const esDocument = await indexDocument(filePath, projectId, puppenv, esClient)

		state.set(projectId, {
			...state.get(projectId),
			currentDocumentIndex: index,
			document: esDocument,
			documentCount: filePaths.length,
			filePath,
			timestamp: new Date().toString(),
		})

		if (isError(esDocument)) return

		index = index + 1
	}
}

enum IndexerStatus {
	Active = 'Active',
	Error = 'Error',
	Done = 'Done',
}
interface IndexerStateData {
	currentDocumentIndex: number
	document: ElasticSearchDocument | DocereApiError
	documentCount: number
	filePath: string
	status: IndexerStatus
	timestamp: string
}
type IndexerState = Map<string, IndexerStateData>

export default function indexerApi(app: Express, puppenv: Puppenv) {
	const state = new Map() as IndexerState

	app.get('/indexer/:projectId/status', async (req, res) => {
		if (!state.has(req.params.projectId)) res.sendStatus(404)
		else send(state.get(req.params.projectId), res)
	})

	app.get('/indexer/status', async (_req, res) => {
		const activeProject = Array.from(state.values()).find(v => v.status === IndexerStatus.Active)
		if (activeProject != null) {
			res.status(503).json(activeProject)
			return
		}
		res.sendStatus(200)
	})

	app.get('/indexer/:projectId?', async (req, res) => {
		if (Array.from(state.values()).some(v => v.status === IndexerStatus.Active)) {
			send({ __error: 'Server is busy', code: 503 }, res)
			return
		}

		const esClient = new es.Client({ node: 'http://es01:9200' })

		// List the project dirs => ['vangogh', 'kranten1700', 'gheys']
		const projectDirs = listProjects()
		
		// Read input from the CLI
		const project = req.params.projectId

		// If the project does not exist return a 404
		if (project != null && project.length && projectDirs.indexOf(project) === -1) {
			send({
				__error: `Project '${project}' not found`,
				code: 404
			}, res)

			esClient.close()

			return
		} else {
			res.sendStatus(200)	
		}

		// If project is empty (nothing entered in the CLI), default to all projects
		const projects = project == null ? projectDirs : [project]

		// Process every project
		for (const projectId of projects) {
			state.set(projectId, {
				currentDocumentIndex: null,
				document: null,
				documentCount: null,
				filePath: null,
				status: IndexerStatus.Active,
				timestamp: new Date().toString(),
			})

			const maxPerDir = parseInt(req.query.max_per_dir as string, 10)
			await indexProject(projectId, puppenv, esClient, state, maxPerDir)

			const currentState = state.get(projectId)
			if (isError(currentState.document)) {
				state.set(projectId, {
					...currentState,
					status: IndexerStatus.Error,
					timestamp: new Date().toString(),
				})
			} else {
				state.set(projectId, {
					...currentState,
					currentDocumentIndex: null,
					document: null,
					filePath: null,
					status: IndexerStatus.Done,
					timestamp: new Date().toString(),
				})
			}
		}

		esClient.close()
	})
}
