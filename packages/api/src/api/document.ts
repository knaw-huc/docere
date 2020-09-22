import { Express } from 'express'

import Puppenv from '../puppenv'
import { addXmlToDb } from '../db/add-documents'
import { initProject } from '../db/init-project'
import { getPool } from '../db'
import { getXmlFiles, getEntryIdFromFilePath } from '../utils'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/api/projects/:projectId/documents/:documentId', async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT json FROM document WHERE name=$1;`, [req.params.documentId])
		res.json(rows[0].json)
	})

	app.post('/api/projects/:projectId/xml/:fileName', async (req, res) => {
		// TODO check if project exists
		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202)

		const { projectId, fileName } = req.params

		await addXmlToDb(projectId, fileName, puppenv)

		res.end()
	})

	app.post('/api/projects/:projectId/xml', async (req, res) => {
		// TODO check if project exists
		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202)

		const { projectId } = req.params
		const files = await getXmlFiles(projectId)
		for (const filePath of files) {
			console.log(`[${projectId}] Adding: '${filePath}'`)
			await addXmlToDb(projectId, getEntryIdFromFilePath(filePath, projectId), puppenv)
		}

		res.end()
	})

	app.post('/api/projects/:projectId/init', async (req, res) => {
		initProject(req.params.projectId)

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})
}
