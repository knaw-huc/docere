import * as es from '@elastic/elasticsearch'
import { Express, Request } from 'express'

import { getPool } from '../db'
import { DOCUMENT_BASE_PATH } from '../constants'
import { getProjectConfig, isError, sendJson } from '../utils'
import { handleSource } from '../db/handle-source'
import { DocereDB } from '../db/docere-db'
import { DocereConfig, JsonEntry, CollectionDocument, isHierarchyMetadataConfig, isListMetadataConfig, isRangeMetadataConfig, HierarchyMetadata } from '@docere/common'
import { fetchSource, sourceIsXml } from '../db/handle-source/fetch-source'

export default function handleDocumentApi(app: Express) {
	app.get(DOCUMENT_BASE_PATH, async (req, res) => {
		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT standoff FROM entry WHERE id=$1;`, [req.params.documentId])
		if (!rows.length) res.sendStatus(404)
		else res.json(rows[0].standoff)
	})

	app.post(DOCUMENT_BASE_PATH, async (req, res) => {
		const projectConfig = await getProjectConfig(req.params.projectId)
		const esClient = new es.Client({ node: process.env.DOCERE_SEARCH_URL })
		const db = await new DocereDB(projectConfig.slug).init()

		if (projectConfig.documents.type !== 'xml') {
			req.body = JSON.parse(req.body)
		}

		const sourceRowId = await handleSource(
			req.body,
			projectConfig,
			req.params.documentId,
			db,
			esClient,
			true
		)

		const entries = await db.selectEntries(sourceRowId)

		res.json(entries)

		db.release()
	})

	app.get(`${DOCUMENT_BASE_PATH}/source`, async (req: Request, res) => {
		const projectConfig = await getProjectConfig(req.params.projectId)
		if (isError(projectConfig)) return sendJson(projectConfig, res)

		const ext = (projectConfig.documents.type === 'xml') ? '.xml' : '.json'
		const filePath = `/${projectConfig.slug}/${req.params.documentId}${ext}`

		const source = await fetchSource(filePath, projectConfig);

		(sourceIsXml(source, projectConfig)) ?
			res.send(source) :
			res.json(source)
	})

	app.get(`${DOCUMENT_BASE_PATH}/collection`, async (req: Request, res) => {
		const config = await getProjectConfig(req.params.projectId)
		if (isError(config)) return sendJson(config, res)

		const pool = await getPool(req.params.projectId)
		const { rows } = await pool.query(`SELECT standoff FROM entry WHERE id=$1;`, [req.params.documentId])
		if (!rows.length)	res.sendStatus(404)
		const entry: JsonEntry = rows[0].standoff
		const payload = getPayload(config, entry)
		const esClient = new es.Client({ node: 'http://es01:9200' })
		const result = await esClient.search({
			body: JSON.parse(payload),
			index: config.slug
		})
		const map = new Map<string, CollectionDocument>()
		for (const hit of result.body.hits.hits) {
			const entryId = hit._source.id 

			for (const facsimile of hit._source.facsimiles) {
				if (map.has(facsimile.id)) {
					const collectionDocument: CollectionDocument = map.get(facsimile.id)
					collectionDocument.entryIds.push(entryId)
				} else {
					map.set(facsimile.id, {
						facsimileId: facsimile.id,
						facsimilePath: facsimile.path,
						entryIds: [entryId]
					})
				}
			}
		}

		res.json(Array.from(map.values()))
	})

	// app.get(`${DOCUMENT_BASE_PATH}/xml`, async (req: Request, res) => {
	// 	const config = await getProjectConfig(req.params.projectId)
	// 	if (isError(config)) return sendJson(config, res)

	// 	const pool = await getPool(req.params.projectId)
	// 	const { rows } = await pool.query(`SELECT standoff FROM source WHERE name=$1;`, [req.params.documentId])
	// 	if (!rows.length) res.sendStatus(404)
	// 	else {
	// 		const standoff = rows[0].standoff
	// 		const tree = new StandoffTree(standoff, config.standoff.exportOptions)
	// 		res.send(tree.exportXml())
	// 	}
	// })

	// app.get(`${PROJECT_BASE_PATH}/xml_prepared/:documentId`, async (req, res) => {
	// 	const pool = await getPool(req.params.projectId)
	// 	const { rows } = await pool.query(`SELECT document.content FROM document, xml WHERE xml.name=$1 AND xml.id=document.xml_id;`, [req.params.documentId])
	// 	if (!rows.length) res.sendStatus(404)
	// 	else res.send(rows[0].content)
	// })
	/*
	 * Usage example:
	 * $ curl -X POST localhost:3000/projects/<projectId>/documents/<docId>/fields -H content-type:text/xml -d @/path/to/file.xml
	 */
	// app.post(`${DOCUMENT_BASE_PATH}/fields`, async (req, res) => {
	// 	if (req.headers['content-type'] !== 'application/xml' && req.headers['content-type'] !== 'text/xml') {
	// 		sendJson({ code: 415, __error: 'Missing the HTTP Content-type header for XML' }, res)
	// 	}
	// 	if (req.body == null || !req.body.length) {
	// 		sendJson({ __error: 'The payload body should be the contents of an XML file.' }, res)
	// 	}

	// 	// const prepareAndExtractOutput = await puppenv.prepareAndExtract(req.body, req.params.projectId, req.params.documentId)
	// 	// if (isError(prepareAndExtractOutput)) {
	// 	// 	sendJson(prepareAndExtractOutput, res)
	// 	// 	return
	// 	// }
	// 	// const [extractedEntry] = prepareAndExtractOutput
	// 	sendJson(getElasticSearchDocument(extractedEntry), res)
	// })
}

function getPayload(config: DocereConfig, entry: JsonEntry) {
	const { collection } = config
	const payload: { size: number, query: any, sort: string | string[], _source: { include: string[] }} = {
		query: null,
		size: 10000,
		sort: collection.sortBy || 'id',
		_source: {
			include: ['id', 'facsimiles']
		}
	}

	if (collection.metadataId == null) {
		payload.query = { match_all: {} }
	} else {
		// const metadata = entry.metadata.find(md => md.config.id === collection.metadataId)
		const metadataConfig = config.metadata2.find(md => md.id === collection.metadataId)
		const value = entry.metadata[collection.metadataId]

		if (metadataConfig == null) return

		if (isHierarchyMetadataConfig(metadataConfig)) {
			const term = (value as HierarchyMetadata['value']).reduce((prev, curr, index) => {
				prev.push({ term: { [`${collection.metadataId}_level${index}`]: curr }})
				return prev
			}, [])

			payload.query = {
				bool: {
					must: term
				}
			}
		} else if (isListMetadataConfig(metadataConfig)) {
			payload.query = {
				term: {
					[collection.metadataId]: value
				}
			}
		} else if (isRangeMetadataConfig(metadataConfig)) {
			payload.query = {
				match_all: {}
			}
		} else {
			console.error('NOT IMPLEMENTED')
			return
		}
	}

	if (collection.sortBy != null) payload.sort = collection.sortBy

	return JSON.stringify(payload)
}
