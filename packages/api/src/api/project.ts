import { Express } from 'express'

import { sendJson, getPageXmlPath, isError, getProjectConfig, getProjectPageConfig } from '../utils'
import { getProjectIndexMapping } from '../es'

import handleAnalyzeApi from './analyze'

export default function handleProjectApi(app: Express) {
	app.get('/api/projects/:projectId/config', async (req, res) => {
		const config = await getProjectConfig(req.params.projectId)
		sendJson(config, res)
	})

	app.get('/api/projects/:projectId/mapping', async (req, res) => {
		const mapping = await getProjectIndexMapping(req.params.projectId)
		sendJson(mapping, res)
	})

	app.get('/api/projects/:projectId/pages/:pageId', async (req, res) => {
		const pageConfig = await getProjectPageConfig(req.params.projectId, req.params.pageId)
		if (isError(pageConfig)) {
			sendJson(pageConfig, res)
			return
		}

		const file = getPageXmlPath(req.params.projectId, pageConfig.path)
		res.sendFile(file)
	})

	app.get('/api/projects/:projectId/pages/:pageId/config', async (req, res) => {
		const pageConfig = await getProjectPageConfig(req.params.projectId, req.params.pageId)
		sendJson(pageConfig, res)
	})

	handleAnalyzeApi(app)
}

	// async getPageConfig(projectId: string, pageId: string) {
	// 	const config = await this.getConfig(projectId)
	// 	if (isError(config)) return config

	// 	// Flatten pages before using .find
	// 	const pagesConfig = config.pages
	// 		.reduce((prev, curr) => {
	// 			if (Array.isArray(curr.children)) prev.push(...curr.children)
	// 			prev.push(curr)
	// 			return prev
	// 		}, [])

	// 	return pagesConfig.find(p => p.id === pageId)
	// }
