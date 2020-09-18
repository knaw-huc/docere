import { Express } from 'express'
import Puppenv from '../puppenv'
import { sendJson, isError, sendText, sendXml } from '../utils'

import type { Request, Response } from 'express'
import type { ExtractedEntry } from '@docere/common'
import type { ExtractedXml } from '../types'
import { getPool } from '../db'
import { PoolClient } from 'pg'
import { xmlToStandoff } from './standoff'

async function tryQuery(client: PoolClient, query: string, values?: string[]) {
	try {
		await client.query(query, values)
	} catch (error) {
		console.log(error)
		console.log('ROLLING BACK')
		await client.query('ROLLBACK')		
	}
}

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
		const { projectId, fileName } = req.params

		const documentFields = await puppenv.prepareAndExtractFromFile(projectId, fileName)
		if (isError(documentFields)) {
			sendJson(documentFields, res)
			return
		}

		const standoff = await xmlToStandoff(projectId, fileName)

		const pool = await getPool(req.params.projectId)
		const client = await pool.connect()

		await tryQuery(client, 'BEGIN')
		await tryQuery(
			client,
			`INSERT INTO xml
				(name, hash, content, prepared, standoff_text, standoff_annotations, updated)
			VALUES
				($1, md5($2), $2, $3, $4, $5, NOW())
			RETURNING id;`,
			[fileName, documentFields[1].original, documentFields[1].original, documentFields[1].prepared, standoff.text, JSON.stringify(standoff.annotations)]
		)
		for (const part of documentFields[0].parts) {
			await tryQuery(
				client,
				`INSERT INTO document
					(name, content, json, updated)
				VALUES
					($1, $2, $3, NOW())
				RETURNING id;`,
				[part.id, part.content, JSON.stringify(part)]
			)
		}
		await tryQuery(client, 'COMMIT')

		// sendJson(documentFields, res)
		res.end()
	})

	app.post('/api/projects/:projectId/init', async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const client = await pool.connect()

		await tryQuery(client, 'BEGIN')
		await tryQuery(client, `DROP TABLE IF EXISTS xml, document, tag, attribute cascade;`)
		await tryQuery(
			client,
			`CREATE TABLE xml (
				id SERIAL PRIMARY KEY,
				name TEXT UNIQUE,
				hash TEXT UNIQUE, 
				content TEXT,
				prepared TEXT,
				standoff_text TEXT,
				standoff_annotations TEXT,
				updated TIMESTAMP WITH TIME ZONE
			);
		`)
		await tryQuery(
			client,
			`CREATE TABLE document (
				id SERIAL PRIMARY KEY,
				name TEXT UNIQUE,
				content TEXT,
				json TEXT,
				standoff_text TEXT,
				standoff_annotations TEXT,
				updated TIMESTAMP WITH TIME ZONE
			);
		`)
		await tryQuery(client, 'COMMIT')

		client.release()

		console.log(`Project '${req.params.projectId}' has an empty db and is ready for documents!`)

		res.end()
	})
}
