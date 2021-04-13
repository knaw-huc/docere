import { Entry, isHierarchyFacetConfig, fetchPost, ID, ElasticSearchFacsimile, DocereConfig } from "@docere/common"
import { isListFacetConfig, isRangeFacetConfig } from "../../../../../search/src"
import { CollectionDocument } from "./controller"

interface Payload {
	size: number
	query: any
	sort: string
	_source: {
		include: string[]
	}
}
function getPayload(entry: Entry, config: DocereConfig['collection']) {
	const payload: Payload = {
		query: null,
		size: 10000,
		sort: config.sortBy || 'id',
		_source: {
			include: ['id', 'facsimiles']
		}
	}

	if (config.metadataId == null) {
		payload.query = { match_all: {} }
	} else {
		const metadata = entry.metadata.find(md => md.id === config.metadataId)

		if (metadata == null) return

		if (isHierarchyFacetConfig(metadata)) {
			const term = metadata.value.reduce((prev, curr, index) => {
				prev.push({ term: { [`${config.metadataId}_level${index}`]: curr }})
				return prev
			}, [])

			payload.query = {
				bool: {
					must: term
				}
			}
		} else if (isListFacetConfig(metadata)) {
			payload.query = {
				term: {
					[metadata.id]: metadata.value
				}
			}
		} else if (isRangeFacetConfig(metadata)) {
			payload.query = {
				match_all: {}
			}
		} else {
			console.error('NOT IMPLEMENTED')
			return
		}
	}

	if (config.sortBy != null) payload.sort = config.sortBy
	return JSON.stringify(payload)
}

/**
 * Fetch entries from ElasticSearch and create a new TiledImages object
 * 
 * @todo move outside controller, when merging with collection-navigator2
 * 
 * @todo 2 entries can "share" a scan, so disambiguate, but...
 * the entry ID has to stay present, because it is needed when a 
 * user clicks 
 */
async function fetchCollectionDocuments(searchUrl: string, payload: string): Promise<CollectionDocument[]> {
	const data = await fetchPost(searchUrl, payload)
	const facsMap = data.hits.hits.reduce((prev: Map<ID, CollectionDocument>, hit: any) => {
		hit._source.facsimiles.forEach((f: ElasticSearchFacsimile) => {
			if (prev.has(f.id)) {
				const cd = prev.get(f.id)
				cd.entryIds.add(hit._source.id)
				prev.set(f.id, cd)
			} else {
				prev.set(f.id, {
					entryIds: new Set([hit._source.id]),
					facsimileId: f.id,
					facsimilePath: f.path,
				})
			}
		})
		return prev
	}, new Map() as Map<ID, CollectionDocument>)

	return Array.from(facsMap.values())
}

// let currentPayload: string
export async function getCollection(entry: Entry, config: DocereConfig['collection'], searchUrl: string): Promise<CollectionDocument[]> {
	const payload = getPayload(entry, config)
	return await fetchCollectionDocuments(searchUrl, payload)
}
