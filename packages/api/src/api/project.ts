import { Express } from 'express'

import { sendJson, isError, getProjectConfig, getProjectPageConfig } from '../utils'
import { getProjectIndexMapping } from '../es'

import handleAnalyzeApi from './analyze'


import { addRemoteFiles } from '../db/add-documents'
import { addPagesToDb } from '../db/add-pages'
import { initProject } from '../db/init-project'
import { initProjectIndex } from '../es'
import { castUrlQueryToNumber } from '../utils'
import Puppenv from '../puppenv'
import { getPool } from '../db'

const PROJECT_BASE_PATH = '/api/projects/:projectId/'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get(`${PROJECT_BASE_PATH}config`, async (req, res) => {
		const config = await getProjectConfig(req.params.projectId)
		sendJson(config, res)
	})

	app.get(`${PROJECT_BASE_PATH}mapping`, async (req, res) => {
		const mapping = await getProjectIndexMapping(req.params.projectId)
		sendJson(mapping, res)
	})

	app.get(`${PROJECT_BASE_PATH}pages/:pageId`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT content FROM page WHERE name=$1;`, [req.params.pageId])
		console.log(rows)
		if (!rows.length) res.sendStatus(404)
		else res.send(rows[0].content)
	})

	app.get(`${PROJECT_BASE_PATH}pages/:pageId/config`, async (req, res) => {
		const pageConfig = await getProjectPageConfig(req.params.projectId, req.params.pageId)
		sendJson(pageConfig, res)
	})

	app.get(`${PROJECT_BASE_PATH}xml/:documentId`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT content FROM xml WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.send(rows[0].content)
	})

	app.post(`${PROJECT_BASE_PATH}xml`, async (req, res) => {
		const { projectId } = req.params
		const config = await getProjectConfig(projectId)
		if (isError(config)) return sendJson(config, res)

		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202).end()

		for (const remotePath of config.documents.remoteDirectories) {
			await addRemoteFiles(remotePath, projectId, puppenv, config, {
				force: req.query.force === '',
				maxPerDir: castUrlQueryToNumber(req.query.max_per_dir as string),
				maxPerDirOffset: castUrlQueryToNumber(req.query.max_per_dir_offset as string)
			})
		}
		await addPagesToDb(config)
	})

	app.post(`${PROJECT_BASE_PATH}init`, async (req, res) => {
		await initProject(req.params.projectId)
		await initProjectIndex(req.params.projectId)

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})

	handleAnalyzeApi(app)
}
