import { Express } from 'express'
import Puppenv from '../puppenv'
import { send, isError, getElasticSearchDocument } from '../utils'
import type { PrepareAndExtractOutput } from '../types'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/projects/:projectId/documents/:documentId', async (req, res) => {
		const documentFields = await puppenv.prepareAndExtractFromFile(req.params.projectId, req.params.documentId)
		send(documentFields, res)
	})

	app.get('/projects/:projectId/documents/:documentId/metadata', async (req, res) => {
		const x = await puppenv.prepareAndExtractFromFile(req.params.projectId, req.params.documentId)
		if (isError(x)) send(x, res)
		else send((x as PrepareAndExtractOutput).metadata, res)
	})

	app.get('/projects/:projectId/documents/:documentId/facsimiles', async (req, res) => {
		const x = await puppenv.prepareAndExtractFromFile(req.params.projectId, req.params.documentId)
		if (isError(x)) send(x, res)
		else send((x as PrepareAndExtractOutput).facsimiles, res)
	})

	app.get('/projects/:projectId/documents/:documentId/fields', async (req, res) => {
		const x = await puppenv.prepareAndExtractFromFile(req.params.projectId, req.params.documentId)
		send(getElasticSearchDocument(x), res)
	})
}
