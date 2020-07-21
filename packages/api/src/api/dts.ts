import { Express } from 'express'

import { listProjects, isError } from '../utils'
import Puppenv from '../puppenv'

import type { DocereConfigData } from '@docere/common'

export default function handleDtsApi(app: Express, puppenv: Puppenv) {
	app.get('/dts', (_req, res) => {
		res.json({
			"@context": "dts/EntryPoint.jsonld",
			"@id": "https://demo.docere.diginfra.net/api/dts",
			"@type": "EntryPoint",
			"collections": "/api/dts/collections",
			"documents": "/api/dts/document",
			"navigation": "/api/dts/navigation",
		})
	})

	app.get('/dts/collections', async (_req, res) => {
		const projectIds = listProjects()
		const configDatas = await Promise.all(projectIds.map(id => puppenv.getConfigData(id)))
		const filtered = configDatas.filter(cd => !isError(cd) && !cd.config.private)


		res.json({
			"@context": {
				"dts": "https://w3id.org/dts/api#",
				"@vocab": "https://www.w3.org/ns/hydra/core#"
			},
			"@type": "Collection",
			"title": "Docere collections",
			"@id": "https://demo.docere.diginfra.net/api/dts/collections",
			"totalItems": filtered.length,
			"member": filtered.map((cd: DocereConfigData) => (
				{
					"totalItems": 4,
					"@type": "Collection",
					"title": cd.config.title,
					"@id": cd.config.slug
				}
			))
		})
	})
}
