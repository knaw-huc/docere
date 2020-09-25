import path from 'path'
import express from 'express'
import { getDirStructure } from './get-dir-structure'

const PORT = 3003
export const PROJECTS_PATH = '/data/xml'

const app = express()
app.disable('x-powered-by')
app.use(express.static(PROJECTS_PATH, { index: false, redirect: false }))

app.get('/:projectId/:path?', (req, res) => {
	const structure = getDirStructure(
		path.resolve(PROJECTS_PATH, req.path.slice(1)),
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
