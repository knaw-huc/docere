import * as path from 'path'
import express from 'express'
import chalk from 'chalk'

import Puppenv from './puppenv'
import { listProjects, getElasticSearchDocument, sendJson, isError } from './utils'
import projectApi from './api/project'
import documentApi from './api/document'
// import indexerApi from './api/indexer'
import dtsApi from './api/dts'
import otherApi from './api/other'

const copyright = `Docere Copyright (C) 2018 - 2020 Gijsjan Brouwer

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
`

const app = express()
app.disable('x-powered-by')
const port = 3000

app.use(express.json())
app.use((req, _res, next) => {
	if (req.get('Content-Type') === 'application/xml' || req.get('Content-Type') === 'text/xml') {
		req.body = ''
		req.setEncoding('utf8')
		req.on('data', (chunk) => { req.body += chunk })
		req.on('end', next)
	} else {
		next()
	}
})

async function main() {
	console.log(chalk.green(copyright))

	const puppenv = new Puppenv()
	await puppenv.start()

	app.get('/api', (_req, res) => res.json({
		title: 'Docere API',
		version: '0.0.0'
	}))

	app.get('/api/swaggerconfig', (_req, res) => {
		res.sendFile(path.resolve('./packages/api/swagger.yml'))
	})

	app.get('/api/projects', (_req, res) => sendJson(listProjects(), res))

	projectApi(app, puppenv)
	documentApi(app, puppenv)
	// indexerApi(app, puppenv)
	dtsApi(app, puppenv)
	otherApi(app)

	/*
	 * Usage example:
	 * $ curl -X POST localhost:3000/projects/<projectId>/documents/<docId>/fields -H content-type:text/xml -d @/path/to/file.xml
	 */
	app.post('/projects/:projectId/documents/:documentId/fields', async (req, res) => {
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

	app.listen(port, () => {
		console.log(`Docere API running on port ${port}`)
	})
}

main()
