import { Express } from 'express'
import Puppenv from '../puppenv'
import { sendJson, isError, sendText, sendXml } from '../utils'

import type { Request, Response } from 'express'
import { ExtractedEntry } from '@docere/common'
import { ExtractedXml } from '../types'

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
const props: Prop[] = ['layers', 'text', 'entities', 'facsimiles', 'metadata', 'notes', 'original', 'prepared']
export default function handleProjectApi(app: Express, puppenv: Puppenv) {
	app.get('/projects/:projectId/documents/:documentId', sendEntry(puppenv))

	for (const prop of props) {
		app.get(`/projects/:projectId/documents/:documentId/${prop}`, sendEntry(puppenv, prop))
	}
}
