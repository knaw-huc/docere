import { Express } from 'express'
import fetch from 'node-fetch'
import { sendXml } from '../utils'


async function getRkdImage(id: string) {
	const url = `http://opendata.rkd.nl/oai-pmh/image?verb=GetRecord&metadataPrefix=oai_rdf&identifier=${id}`
	const response = await fetch(url)
	return await response.text()
}

export default function handleOtherApi(app: Express) {
	app.get('/rkdimages/:key', async (req, res) => {
		const data = await getRkdImage(req.params.key)
		sendXml(data, res)
	})
}
