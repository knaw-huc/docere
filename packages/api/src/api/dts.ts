import { Express } from 'express'

import { listProjects, isError, getProjectConfig } from '../utils'

import type { DocereConfig } from '@docere/common'

export default function handleDtsApi(app: Express) {
	app.get('/api/dts', (_req, res) => {
		res.json({
			"@context": "dts/EntryPoint.jsonld",
			"@id": "https://demo.docere.diginfra.net/api/dts",
			"@type": "EntryPoint",
			"collections": "/api/dts/collections",
			"documents": "/api/dts/document",
			"navigation": "/api/dts/navigation",
		})
	})

	app.get('/api/dts/collections', async (_req, res) => {
		const projectIds = listProjects()
		const configs = await Promise.all(projectIds.map(id => getProjectConfig(id)))
		const filtered = configs.filter(config => !isError(config) && !config.private)

		res.json({
			"@context": {
				"dts": "https://w3id.org/dts/api#",
				"@vocab": "https://www.w3.org/ns/hydra/core#"
			},
			"@type": "Collection",
			"title": "Docere collections",
			"@id": "https://demo.docere.diginfra.net/api/dts/collections",
			"totalItems": filtered.length,
			"member": filtered.map((config: DocereConfig) => (
				{
					"totalItems": 4,
					"@type": "Collection",
					"title": config.title,
					"@id": config.slug
				}
			))
		})
	})
}
