import { Express } from 'express'

import Puppenv from '../puppenv'
import { getXmlFiles, sendJson } from '../utils'

import type { Mapping, DocereApiError } from '../types'
import handleAnalyzeApi from './analyze'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/projects/:projectId/config', async (req, res) => {
		const configData = await puppenv.getConfigData(req.params.projectId)

		sendJson(configData, res)
	})

	app.get('/projects/:projectId/mapping', async (req, res) => {
		const files = await getXmlFiles(req.params.projectId)

		let mapping: Mapping | DocereApiError
		try {
			mapping = await puppenv.getMapping(req.params.projectId, files)
		} catch (err) {
			mapping = { code: 404, __error: err.message }
		}

		sendJson(mapping, res)
	})

	handleAnalyzeApi(app)
}
