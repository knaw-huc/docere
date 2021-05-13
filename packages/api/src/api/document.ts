import { Express } from 'express'
import { getPool } from '../db'
import { DOCUMENT_BASE_PATH } from '../constants'
import { getProjectConfig, isError, sendJson } from '../utils'
import { StandoffTree } from '@docere/common'

export default function handleDocumentApi(app: Express) {
	app.get(DOCUMENT_BASE_PATH, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT entry FROM document WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.json(rows[0].entry)
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
