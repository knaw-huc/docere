import { Express } from 'express'
import { getPool } from '../../db'
import { sendJson } from '../../utils'
import { analyzeProject } from './project'

const BASE_URL = '/projects/:projectId/analyze'

export default function handleAnalyzeApi(app: Express) {
	app.get(BASE_URL, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query(
			`SELECT
				array_agg(DISTINCT document.name) as documents,
				array_agg(DISTINCT tag.name) as tags,
				array_agg(DISTINCT attribute.name) as attributeNames,
				array_agg(DISTINCT attribute.value) as attributeValues
			FROM document, tag, attribute;`
		)
		console.log(result)
		sendJson(result.rows[0], res)
	})

	app.get(`${BASE_URL}/documents`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query('SELECT array_agg(DISTINCT name) as agg FROM document;')
		sendJson(result.rows[0].agg, res)
	})

	app.get(`${BASE_URL}/tags`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query('SELECT array_agg(DISTINCT name) as agg FROM tag;')
		sendJson(result.rows[0].agg, res)
	})

	app.get(`${BASE_URL}/tags/:tag`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query(`SELECT * FROM tag WHERE name=$1;`, [req.params.tag])
		sendJson(result.rows, res)
	})

	app.get(`${BASE_URL}/tags/:tag/:id`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query(
			`SELECT
				tag.*,
				document.name as document_name,
				substring(document.text, tag.startOffset, tag.endOffset - tag.startOffset) AS text
			FROM
				document, tag
			WHERE
					tag.id=$1
				AND
					tag.document_id=document.id;`,
			[req.params.id]
		)
		sendJson(result.rows[0], res)
	})

	app.get(`${BASE_URL}/attributeNames`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query('SELECT array_agg(DISTINCT name) as agg FROM attribute;')
		sendJson(result.rows[0].agg, res)
	})

	app.get(`${BASE_URL}/attributeValues`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const result = await pool.query('SELECT array_agg(DISTINCT value) as agg FROM attribute;')
		sendJson(result.rows[0].agg, res)
	})

	app.post(BASE_URL, async (req, res) => {
		analyzeProject(req.params.projectId)
		res.end()
	})
}
