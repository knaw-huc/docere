import { Express } from 'express'
import { getPool } from '../db'
import Puppenv from '../puppenv'
import { sendJson, isError, getElasticSearchDocument } from '../utils'
import { DOCUMENT_BASE_PATH } from '../constants'


export default function handleDocumentApi(app: Express, puppenv: Puppenv) {
	app.get(DOCUMENT_BASE_PATH, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT json FROM document WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.json(rows[0].json)
	})

	/*
	 * Usage example:
	 * $ curl -X POST localhost:3000/projects/<projectId>/documents/<docId>/fields -H content-type:text/xml -d @/path/to/file.xml
	 */
	app.post(`${DOCUMENT_BASE_PATH}/fields`, async (req, res) => {
		if (req.headers['content-type'] !== 'application/xml' && req.headers['content-type'] !== 'text/xml') {
			sendJson({ code: 415, __error: 'Missing the HTTP Content-type header for XML' }, res)
		}
		if (req.body == null || !req.body.length) {
			sendJson({ __error: 'The payload body should be the contents of an XML file.' }, res)
		}

		const prepareAndExtractOutput = await puppenv.prepareAndExtract(req.body, req.params.projectId, req.params.documentId)
		if (isError(prepareAndExtractOutput)) {
			sendJson(prepareAndExtractOutput, res)
			return
		}
		const [extractedEntry] = prepareAndExtractOutput
		sendJson(getElasticSearchDocument(extractedEntry), res)
	})
}
