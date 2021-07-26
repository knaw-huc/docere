import * as es from '@elastic/elasticsearch'
import { Express } from 'express'
import { StandoffTree } from '@docere/common'

import { getPool } from '../db'
import { DOCUMENT_BASE_PATH } from '../constants'
import { getProjectConfig, isError, sendJson } from '../utils'
import { handleSource } from '../db/handle-source'

export default function handleDocumentApi(app: Express) {
	app.get(DOCUMENT_BASE_PATH, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT entry FROM document WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.json(rows[0].entry)
	})

	app.post(DOCUMENT_BASE_PATH, async (req, res) => {
		const projectConfig = await getProjectConfig(req.params.projectId)
		const pool = await getPool(projectConfig.slug)
		const client = await pool.connect()
		const esClient = new es.Client({ node: process.env.DOCERE_SEARCH_URL })

		if (projectConfig.documents.type !== 'xml') {
			req.body = JSON.parse(req.body)
		}

		const sourceRowId = await handleSource(
			req.body,
			projectConfig,
			req.params.documentId,
			client,
			esClient,
			true
		)

		client.release()

		const { rows } = await pool.query(`SELECT * FROM document WHERE source_id=$1;`, [sourceRowId])

		res.json(rows)
	})

	app.get(`${DOCUMENT_BASE_PATH}/source`, async (req, res) => {
		const config = await getProjectConfig(req.params.projectId)
		if (isError(config)) return sendJson(config, res)

		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT content FROM source WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else {
			res.send(rows[0].content)
		}
	})

	app.get(`${DOCUMENT_BASE_PATH}/xml`, async (req, res) => {
		const config = await getProjectConfig(req.params.projectId)
		if (isError(config)) return sendJson(config, res)

		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT standoff FROM source WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else {
			const standoff = rows[0].standoff
			const tree = new StandoffTree(standoff, config.standoff.exportOptions)
			res.send(tree.exportXml())
		}
	})

	// app.get(`${PROJECT_BASE_PATH}/xml_prepared/:documentId`, async (req, res) => {
	// 	const pool = await getPool(req.params.projectId)
	// 	const { rows } = await pool.query(`SELECT document.content FROM document, xml WHERE xml.name=$1 AND xml.id=document.xml_id;`, [req.params.documentId])
	// 	if (!rows.length) res.sendStatus(404)
	// 	else res.send(rows[0].content)
	// })
	/*
	 * Usage example:
	 * $ curl -X POST localhost:3000/projects/<projectId>/documents/<docId>/fields -H content-type:text/xml -d @/path/to/file.xml
	 */
	// app.post(`${DOCUMENT_BASE_PATH}/fields`, async (req, res) => {
	// 	if (req.headers['content-type'] !== 'application/xml' && req.headers['content-type'] !== 'text/xml') {
	// 		sendJson({ code: 415, __error: 'Missing the HTTP Content-type header for XML' }, res)
	// 	}
	// 	if (req.body == null || !req.body.length) {
	// 		sendJson({ __error: 'The payload body should be the contents of an XML file.' }, res)
	// 	}

	// 	// const prepareAndExtractOutput = await puppenv.prepareAndExtract(req.body, req.params.projectId, req.params.documentId)
	// 	// if (isError(prepareAndExtractOutput)) {
	// 	// 	sendJson(prepareAndExtractOutput, res)
	// 	// 	return
	// 	// }
	// 	// const [extractedEntry] = prepareAndExtractOutput
	// 	sendJson(getElasticSearchDocument(extractedEntry), res)
	// })
}
