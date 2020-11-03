import { Express } from 'express'
import { getPool } from '../db'

export default function handleDocumentApi(app: Express) {
	app.get('/api/projects/:projectId/documents/:documentId', async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT json FROM document WHERE name=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.json(rows[0].json)
	})
}
