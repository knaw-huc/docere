import { Express, Request } from 'express'

import { sendJson, isError, getProjectConfig, getProjectPageConfig } from '../utils'
import { getProjectIndexMapping } from '../es'

// import handleAnalyzeApi from './analyze'

import { addRemoteStandoffToDb } from '../db/handle-source'
import { initProject } from '../db/init-project'
import { initProjectIndex } from '../es'
import { castUrlQueryToNumber } from '../utils'
import { getPool } from '../db'
import { dtapMap } from '../../../projects/src/dtap'
import { DTAP } from '@docere/common'
import { PROJECT_BASE_PATH } from '../constants'
import { performance } from 'perf_hooks'

// @ts-ignore
const DOCERE_DTAP = DTAP[process.env.DOCERE_DTAP]

export default function handleProjectApi(app: Express) {
	app.use(PROJECT_BASE_PATH, (req, res, next) => {
		if (dtapMap[req.params.projectId] < DOCERE_DTAP) res.sendStatus(404)
		else next()
	})

	app.get(`${PROJECT_BASE_PATH}/config`, async (req: Request, res) => {
		const config = await getProjectConfig(req.params.projectId)
		sendJson(config, res)
	})

	app.get(`${PROJECT_BASE_PATH}/mapping`, async (req: Request, res) => {
		const mapping = await getProjectIndexMapping(req.params.projectId)
		sendJson(mapping, res)
	})

	app.get(`${PROJECT_BASE_PATH}/pages`, async (req: Request, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT name FROM page;`)
		sendJson(rows, res)
	})

	app.get(`${PROJECT_BASE_PATH}/pages/:pageId`, async (req: Request, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT content FROM page WHERE name=$1;`, [req.params.pageId])
		if (!rows.length) res.sendStatus(404)
		else res.send(rows[0].content)
	})

	app.get(`${PROJECT_BASE_PATH}/pages/:pageId/config`, async (req: Request, res) => {
		const pageConfig = await getProjectPageConfig(req.params.projectId, req.params.pageId)
		sendJson(pageConfig, res)
	})

	// app.get(`${PROJECT_BASE_PATH}/xml/:documentId`, async (req, res) => {
	// 	const pool = await getPool(req.params.projectId)
	// 	const { rows } = await pool.query(`SELECT content FROM xml WHERE name=$1;`, [req.params.documentId])
	// 	if (!rows.length) res.sendStatus(404)
	// 	else res.send(rows[0].content)
	// })

	// app.get(`${PROJECT_BASE_PATH}/xml_prepared/:documentId`, async (req, res) => {
	// 	const pool = await getPool(req.params.projectId)
	// 	const { rows } = await pool.query(`SELECT document.content FROM document, xml WHERE xml.name=$1 AND xml.id=document.xml_id;`, [req.params.documentId])
	// 	if (!rows.length) res.sendStatus(404)
	// 	else res.send(rows[0].content)
	// })

	// app.post(`${PROJECT_BASE_PATH}/xml`, async (req, res) => {
	// 	const { projectId } = req.params
	// 	const config = await getProjectConfig(projectId)
	// 	if (isError(config)) return sendJson(config, res)

	// 	// Return an async ACCEPTED immediately, the server will handle it from here
	// 	res.sendStatus(202).end()

	// 	for (const remotePath of config.documents.remoteDirectories) {
	// 		await addRemoteFiles(remotePath, projectId, puppenv, config, {
	// 			force: req.query.force === '',
	// 			maxPerDir: castUrlQueryToNumber(req.query.max_per_dir as string),
	// 			maxPerDirOffset: castUrlQueryToNumber(req.query.max_per_dir_offset as string)
	// 		})
	// 	}
	// 	await addPagesToDb(config)
	// })

	app.post(`${PROJECT_BASE_PATH}/upsert`, async (req: Request, res) => {
		const { projectId } = req.params
		const config = await getProjectConfig(projectId)
		if (isError(config)) return sendJson(config, res)

		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202).end()

		const t0 = performance.now()
		for (const remotePath of config.documents.remoteDirectories) {
			await addRemoteStandoffToDb(remotePath, config, {
				force: req.query.force === '',
				maxPerDir: castUrlQueryToNumber(req.query.max_per_dir as string),
				maxPerDirOffset: castUrlQueryToNumber(req.query.max_per_dir_offset as string)
			})
		}
		const t1 = performance.now(); console.log('Performance: ', `${t1 - t0}ms`)
	})

	app.post(`${PROJECT_BASE_PATH}/init`, async (req: Request, res) => {
		await initProject(req.params.projectId)
		await initProjectIndex(req.params.projectId)

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})

	// handleAnalyzeApi(app)
}
