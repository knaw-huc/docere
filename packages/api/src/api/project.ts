import { Express } from 'express'

import Puppenv from '../puppenv'
import { sendJson, getPageXmlPath, isError } from '../utils'

import handleAnalyzeApi from './analyze'
import { getProjectIndexMapping } from '../es'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/api/projects/:projectId/config', async (req, res) => {
		const config = await puppenv.getConfig(req.params.projectId)
		sendJson(config, res)
	})

	app.get('/api/projects/:projectId/mapping', async (req, res) => {
		const mapping = await getProjectIndexMapping(req.params.projectId)
		sendJson(mapping, res)
	})

	app.get('/api/projects/:projectId/pages/:pageId', async (req, res) => {
		const pageConfig = await puppenv.getPageConfig(req.params.projectId, req.params.pageId)
		if (isError(pageConfig)) {
			sendJson(pageConfig, res)
			return
		}

		const file = getPageXmlPath(req.params.projectId, pageConfig.path)
		res.sendFile(file)
	})

	app.get('/api/projects/:projectId/pages/:pageId/config', async (req, res) => {
		const pageConfig = await puppenv.getPageConfig(req.params.projectId, req.params.pageId)
		sendJson(pageConfig, res)
	})

	handleAnalyzeApi(app)
}
