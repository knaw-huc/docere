import pg from 'pg'
import { Express, Request } from 'express'

import { sendJson, isError, getProjectConfig, getProjectPageConfig } from '../utils'
import { getProjectIndexMapping } from '../es'

import { addRemoteStandoffToDb } from '../db/handle-source'
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
	let upserting = false

	app.post(`${PROJECT_BASE_PATH}/upsert`, async (req: Request, res) => {
		const { projectId } = req.params
		if (upserting) {
			res.sendStatus(503).end()
			return
		}

		const config = await getProjectConfig(projectId)
		if (isError(config)) return sendJson(config, res)

		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202).end()

		upserting = true
		const t0 = performance.now()
		await addRemoteStandoffToDb(config.slug, config, {
			force: req.query.force === '',
			maxPerDir: castUrlQueryToNumber(req.query.max_per_dir as string),
			maxPerDirOffset: castUrlQueryToNumber(req.query.max_per_dir_offset as string)
		})
		const t1 = performance.now(); console.log('Performance: ', `${t1 - t0}ms`)
		upserting = false
	})

	app.post(`${PROJECT_BASE_PATH}/init`, async (req: Request, res) => {
		const { projectId } = req.params
		const dbName = `docere_${projectId}`

		const pool = new pg.Pool()

		try {
			await pool.query(`DROP DATABASE IF EXISTS ${dbName};`)
		} catch (error) {
			console.log(error)
			pool.end()
			res.sendStatus(500)
			return
		}

		try {
			await pool.query(`CREATE DATABASE ${dbName};`)
		} catch (error) {
			console.log(error)
			pool.end()
			res.sendStatus(500)
			return
		}

		pool.end()

		const projectPool = await getPool(projectId)

		await projectPool.query(
			`CREATE TABLE source (
				id TEXT PRIMARY KEY,
				hash TEXT UNIQUE,
				standoff JSON,
				updated TIMESTAMP WITH TIME ZONE
			);
		`)


		await projectPool.query(
			`CREATE TABLE entry (
				id TEXT PRIMARY KEY,
				source_id TEXT REFERENCES source,
				order_number INT,
				standoff JSON,
				updated TIMESTAMP WITH TIME ZONE
			);
		`)

		await initProjectIndex(req.params.projectId)

		res.end()

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)
	})

	// handleAnalyzeApi(app)
}

// class DocereApiError {
// 	constructor(private _message: string, private _code: number = 400) {}

// 	get code() {
// 		return this._code
// 	}

// 	get message() {
// 		return this._message
// 	}
// }

		// await transactionQuery(
		// 	client,
		// 	`CREATE TABLE page (
		// 		id SERIAL PRIMARY KEY,
		// 		name TEXT UNIQUE,
		// 		hash TEXT, 
		// 		xml TEXT,
		// 		standoff TEXT,
		// 		updated TIMESTAMP WITH TIME ZONE
		// 	);
		// `)
		// await transactionQuery(
		// 	client,
		// 	`CREATE TABLE page_item (
		// 		id SERIAL PRIMARY KEY,
		// 		page_id SERIAL REFERENCES page,
		// 		order_number INT,
		// 		name TEXT UNIQUE,
		// 		content TEXT,
		// 		json JSONB,
		// 		standoff_text TEXT,
		// 		standoff_annotations TEXT,
		// 		updated TIMESTAMP WITH TIME ZONE
		// 	);
		// `)
	// }	
		// const db = await new DocereDB(req.params.projectId).init()
		// const createTablesResult = await db.createTables()
		// db.release()

		// if (isError(createTablesResult)) {
		// 	console.log(`[ERROR] ${createTablesResult.__error}`)
		// 	res.json(createTablesResult)
		// 	return
		// }
