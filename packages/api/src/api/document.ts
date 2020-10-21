import { Express } from 'express'
import fetch from 'node-fetch'

import Puppenv from '../puppenv'
import { addXmlToDb, addRemoteFiles } from '../db/add-documents'
import { initProject } from '../db/init-project'
import { initProjectIndex } from '../es'
import { getPool } from '../db'
import { castUrlQueryToNumber } from '../utils'

export default function handleDocumentApi(app: Express, puppenv: Puppenv) {
	app.get('/api/projects/:projectId/documents/:documentId', async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT json FROM document WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.json(rows[0].json)
	})

	app.get('/api/projects/:projectId/xml/:fileName', async (req, res) => {
		const { projectId, fileName } = req.params

		const xmlEndpoint = `${process.env.DOCERE_XML_URL}/${projectId}/${fileName}.xml`

		const result = await fetch(xmlEndpoint)
		const xml = await result.text()

		res.send(xml)
	})

	app.post('/api/projects/:projectId/xml/:fileName', async (req, res) => {
		// TODO check if project exists
		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202)

		const { projectId, fileName } = req.params

		const xmlEndpoint = `${process.env.DOCERE_XML_URL}/${projectId}/${fileName}.xml`
		const result = await fetch(xmlEndpoint)
		if (result.status === 404) {
			res.status(404).end()
			return
		}
		const content = await result.text()

		await addXmlToDb(content, projectId, fileName, puppenv, req.query.force === '')

		res.end()
	})

	app.post('/api/projects/:projectId/xml', async (req, res) => {
		// TODO check if project exists
		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202).end()

		const { projectId } = req.params

		console.log(req.query)
		addRemoteFiles(projectId, projectId, puppenv, {
			force: req.query.force === '',
			maxPerDir: castUrlQueryToNumber(req.query.max_per_dir as string),
			maxPerDirOffset: castUrlQueryToNumber(req.query.max_per_dir_offset as string)
		})
	})

	app.post('/api/projects/:projectId/init', async (req, res) => {
		await initProject(req.params.projectId)
		await initProjectIndex(req.params.projectId)

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})
}
