import { Express } from 'express'
import fetch from 'node-fetch'

import { xml2standoff } from '../utils/xml2standoff'
import { sendJson, sendXml } from '../utils'

async function getRkdImage(id: string) {
	const url = `http://opendata.rkd.nl/oai-pmh/image?verb=GetRecord&metadataPrefix=oai_rdf&identifier=${id}`
	const response = await fetch(url)
	return await response.text()
}

export default function handleOtherApi(app: Express) {
	app.get('/api/rkdimages/:key', async (req, res) => {
		const data = await getRkdImage(req.params.key)
		sendXml(data, res)
	})

	// TODO test this endpoint
	app.post('/api/xml2standoff', async (req, res) => {
		const data = await xml2standoff(req.body)
		sendJson(data, res)
	})
}
