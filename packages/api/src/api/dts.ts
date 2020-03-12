import { Express } from 'express'
import { listProjects } from '../utils'

export default function handleDtsApi(app: Express) {
	app.get('/api/dts', (_req, res) => {
		res.json({
			"@context": "dts/EntryPoint.jsonld",
			"@id": "/api/dts",
			"@type": "EntryPoint",
			"collections": "/api/dts/collections",
			"documents": "/api/dts/document",
			"navigation": "/api/dts/navigation",
		})
	})

	app.get('/api/dts/collections', (_req, res) => {
		const projectIds = listProjects()

		res.json({
			"@context": {
				"dts": "https://w3id.org/dts/api#",
				"@vocab": "https://www.w3.org/ns/hydra/core#"
			},
			"@type": "Collection",
			"title": "Docere collections",
			"@id": "docerecollections",
			"totalItems": projectIds.length,
			"member": projectIds.map(id => (
				{
					"totalItems": 4,
					"@type": "Collection",
					"title": "Grec Ancien",
					"@id": id
				}
			))
		})
	})
}
