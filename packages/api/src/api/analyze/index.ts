import { Express } from 'express'
import { getPool } from '../../db'
import { sendJson } from '../../utils'
import { analyzeProject } from './project'
import { xmlToStandoff } from '../standoff'

const BASE_URL = '/api/projects/:projectId/analyze'

export default function handleAnalyzeApi(app: Express) {
	app.get(`${BASE_URL}/documents/:documentId/standoff`, async (req, res) => {
		const standoff = await xmlToStandoff(req.params.projectId, req.params.documentId)
		sendJson(standoff, res)
	})

	app.get(`${BASE_URL}/documents`, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		let result
		try {
			result = await pool.query('SELECT array_agg(DISTINCT name) as agg FROM document;')
		} catch (err) {
			sendJson({ __error: err.toString() }, res)
			return
		}
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

	app.post(`${BASE_URL}/tmp`, async (req, res) => {
		const pool = await getPool(req.params.projectId)

		if (req.body == null || !Object.keys(req.body).length) {
			sendJson({ __error: "The payload can't be empty." }, res)
			return
		}

		if (req.body.document_name == null && req.body.tag_name == null && req.body.attribute_name == null && req.body.attribute_value == null) {
			sendJson({ __error: "The payload is not formatted correctly." }, res)
			return
		}

		const andDocumentName = req.body.document_name == null ? '' : req.body.document_name.reduce((prev: string, curr: string) => `${prev} AND document.name='${curr}'`, '')
		const andTagName = req.body.tag_name == null ? '' : req.body.tag_name.reduce((prev: string, curr: string) => `${prev} AND tag.name='${curr}'`, '')
		const andAttributeName = req.body.attribute_name == null ? '' : req.body.attribute_name.reduce((prev: string, curr: string) => `${prev} AND attribute.name='${curr}'`, '')
		const andAttributeValue = req.body.attribute_value == null ? '' : req.body.attribute_value.reduce((prev: string, curr: string) => `${prev} AND attribute.value='${curr}'`, '')

		if (!(andDocumentName + andTagName + andAttributeName + andAttributeValue).length) {
			sendJson({ __error: "The payload can't be empty." }, res)
			return
		}

		const query = `
			SELECT
				array_agg(DISTINCT document.name) as documents,
				array_agg(DISTINCT tag.name) as tags,
				array_agg(DISTINCT attribute.name) as attribute_names,
				array_agg(DISTINCT attribute.value) as attribute_values
			FROM
				document, tag, attribute
			WHERE
				attribute.tag_id=tag.id
					AND
				tag.document_id=document.id
				${andDocumentName}
				${andTagName}
				${andAttributeName}
				${andAttributeValue};`


		const result = await pool.query(query)

		sendJson(result.rows[0], res)
	})
}

