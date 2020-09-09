import { Express } from 'express'

import Puppenv from '../puppenv'
import { getXmlFiles, sendJson, getPageXmlPath, isError } from '../utils'

import type { Mapping, DocereApiError } from '../types'
import handleAnalyzeApi from './analyze'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/api/projects/:projectId/config', async (req, res) => {
		const configData = await puppenv.getConfigData(req.params.projectId)
		sendJson(configData, res)
	})

	app.get('/api/projects/:projectId/mapping', async (req, res) => {
		const files = await getXmlFiles(req.params.projectId)

		let mapping: Mapping | DocereApiError
		try {
			mapping = await puppenv.getMapping(req.params.projectId, files)
		} catch (err) {
			mapping = { code: 404, __error: err.message }
		}

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
