import path from 'path'
import express from 'express'
import { getDirStructure } from './get-dir-structure'

const PORT = 3003

export const BASE_PATH = process.env.DOCERE_XML_BASE_PATH != null ?
	process.env.DOCERE_XML_BASE_PATH :
	'/data/xml'

const app = express()
app.disable('x-powered-by')
app.use(express.static(BASE_PATH, { index: false, redirect: false }))

app.get('/:projectId/:path?', (req, res) => {
	const structure = getDirStructure(
		path.resolve(BASE_PATH, req.path.slice(1)),
		parseInt(req.query.max_per_dir as string, 10)
	)
	if (structure == null) {
		res.status(404).end()
		return
	}
	res.json(structure)
})

app.listen(PORT, () => {
	console.log(`Docere XML file server running on port ${PORT}`)
})
