import { Express } from 'express'
import fetch from 'node-fetch'

import Puppenv from '../puppenv'
import { addXmlToDb, addRemoteFiles } from '../db/add-documents'
import { initProject } from '../db/init-project'
import { getPool } from '../db'

export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/api/projects/:projectId/documents/:documentId', async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT json FROM document WHERE name=$1;`, [req.params.documentId])
		res.json(rows[0].json)
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

		const xmlEndpoint = `${process.env.DOCERE_XML_URL}/${projectId}/${fileName}`
		const result = await fetch(xmlEndpoint)
		const content = await result.text()

		await addXmlToDb(content, projectId, fileName, puppenv)

		res.end()
	})

	app.post('/api/projects/:projectId/xml', async (req, res) => {
		// TODO check if project exists
		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202).end()


		const { projectId } = req.params
		addRemoteFiles(projectId, projectId, puppenv)

		// const files = await getXmlFiles(projectId)

		// res.end()
	})

	app.post('/api/projects/:projectId/init', async (req, res) => {
		await initProject(req.params.projectId)

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})
}
