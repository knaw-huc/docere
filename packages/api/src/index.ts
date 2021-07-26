import fs from 'fs'
import path from 'path'
import express from 'express'
import chalk from 'chalk'

import { listProjects, sendJson } from './utils'
import projectApi from './api/project'
import documentApi from './api/document'
import dtsApi from './api/dts'
import otherApi from './api/other'
import { BASE_PATH } from './constants'

const copyright = `Docere Copyright (C) 2018 - 2021 Gijsjan Brouwer

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

app.use(express.json())
app.use((req, _res, next) => {
	if (BODY_CONTENT_TYPES.has(req.get('Content-Type'))) {
		req.body = ''
		req.setEncoding('utf8')
		req.on('data', chunk => { req.body += chunk })
		req.on('end', next)
	} else {
		next()
	}
})

async function main() {
	console.log(chalk.green(copyright))

	app.get(BASE_PATH, (_req, res) => {
		const pkg = fs.readFileSync(path.resolve('./packages/api/package.json'), 'utf8')

		res.json({
			title: 'Docere API',
			version: JSON.parse(pkg).version
		})
	})

	app.get(`${BASE_PATH}/swaggerconfig`, (_req, res) => {
		res.sendFile(path.resolve('./packages/api/swagger.yml'))
	})

	app.get(`${BASE_PATH}/projects`, (_req, res) => sendJson(listProjects(), res))

	projectApi(app)
	documentApi(app)
	dtsApi(app)
	otherApi(app)

	app.listen(process.env.DOCERE_API_PORT, () => {
		console.log(`Docere API running on port ${process.env.DOCERE_API_PORT}`)
	})
}

main()

const BODY_CONTENT_TYPES = new Set([
	'application/xml',
	'text/xml',
	'text/plain'
])
