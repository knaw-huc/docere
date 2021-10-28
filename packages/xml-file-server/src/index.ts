import fs from 'fs'
import path from 'path'
import express from 'express'
import { getDirStructure } from './get-dir-structure'

const pkgStr = fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf8')
const pkg = JSON.parse(pkgStr)

export const BASE_FILE_PATH = process.env.DOCERE_XML_BASE_PATH != null ?
	process.env.DOCERE_XML_BASE_PATH :
	'/data/xml'

// const BASE_REQUEST_PATH = '/data'

const app = express()
app.disable('x-powered-by')

// If a static file is requested, return it
app.use('/', express.static(BASE_FILE_PATH, { index: false, redirect: false }))

app.get('/', (_req, res) => {
	res.send(`Docere XML server\nversion: ${pkg.version}\n`)
})

app.get(['/:projectId', '/:projectId/*'], (req, res) => {
	const structure = getDirStructure(
		path.resolve(BASE_FILE_PATH, req.path.slice(1)),
		req.query.filterByExt?.toString(),
		parseInt(req.query.max_per_dir as string, 10)
	)
	if (structure == null) {
		res.status(404).end()
		return
	}
	console.log(`Request from: ${req.path} (${structure.directories.length} directories and ${structure.files.length} files)`)

	res.json(structure)
})

if (process.env.DOCERE_XML_PORT == null) throw new Error("[ERROR] DOCERE_XML_PORT not set")

app.listen(process.env.DOCERE_XML_PORT, () => {
	console.log(`Docere XML server running on port ${process.env.DOCERE_XML_PORT}`)
	console.log('Reading files from directory: ', BASE_FILE_PATH)
})
