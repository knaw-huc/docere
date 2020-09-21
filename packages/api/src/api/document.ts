import { Express } from 'express'

import Puppenv from '../puppenv'
import { sendJson, isError, sendText, sendXml } from '../utils'
import { addDocumentsToDb } from '../db/add-documents'
import { initProject } from '../db/init-project'

import type { Request, Response } from 'express'
import type { ExtractedEntry } from '@docere/common'
import type { ExtractedXml } from '../types'

function sendEntry(puppenv: Puppenv, prop?: Prop) {
	return async (req: Request, res: Response) => {
		const documentFields = await puppenv.prepareAndExtractFromFile(req.params.projectId, req.params.documentId)
		if (isError(documentFields)) {
			sendJson(documentFields, res)
			return
		}

		const [extractedEntry, extractedXml] = documentFields

		if (prop == null) {
			sendJson(extractedEntry, res)
		} else if (prop === 'text') {
			sendText(extractedEntry[prop], res)
		} else if (prop === 'original' || prop === 'prepared') {
			sendXml(extractedXml[prop], res)
		} else {
			sendJson(extractedEntry[prop], res)
		}
	}
}

type Prop = (keyof ExtractedEntry | keyof ExtractedXml)
const props: Prop[] = ['layers', 'text', 'entities', 'metadata', 'notes', 'original', 'prepared']
export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/api/projects/:projectId/documents/:documentId', sendEntry(puppenv))

	for (const prop of props) {
		app.get(`/api/projects/:projectId/documents/:documentId/${prop}`, sendEntry(puppenv, prop))
	}

	app.post('/api/projects/:projectId/xml/:fileName', async (req, res) => {
		// TODO check if project exists
		// Return an async ACCEPTED immediately, the server will handle it from here
		res.sendStatus(202)

		const { projectId, fileName } = req.params

		addDocumentsToDb(projectId, fileName, puppenv)

		res.end()
	})

	app.post('/api/projects/:projectId/init', async (req, res) => {
		initProject(req.params.projectId)

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})
}
