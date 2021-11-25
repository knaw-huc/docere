import { ProjectContextValue, ActiveFacsimile, ProjectAction, CollectionDocument, MetadataValue, getEntryApiPath } from '@docere/common'
import OpenSeadragon from 'openseadragon';
import TiledImages from './tiled-images'
import { CollectionNavigatorBaseController } from './base-controller'

import type { Entry } from '@docere/common'

/**
 * Controller for fetching all facsimile IDs and facsimile paths from a collection
 * of entries. The collection is defined in {@link DocereConfig.collection} and used
 * to give the user an overview of the position of an entry within a collection.
 */
export class CollectionNavigatorController extends CollectionNavigatorBaseController {
	private entry: Entry
	private metadataValue: MetadataValue

	constructor(
		viewer: OpenSeadragon.Viewer,
		dispatch: React.Dispatch<ProjectAction>,
		projectContext: ProjectContextValue
	) {
		super(viewer, dispatch, projectContext)
	}

	async setEntry(entry: Entry, facsimile: ActiveFacsimile) {
		this.entry = entry

		// const nextPayload = this.getPayload()
		// if (nextPayload == null) return

		const metadataValue = entry.metadata.get(this.projectContext.config.collection.metadataId).value
		if (metadataValue !== this.metadataValue) {
			this.metadataValue = metadataValue
			const entries = await this.fetchCollectionDocuments(entry.id)
			this.tiledImages?.removeListeners()
			this.tiledImages = new TiledImages(this.viewer, entries, this.entry, facsimile)
		} else {
			console.log('OOK HIER')
			const success = this.tiledImages.setEntry(entry, facsimile)
			// TODO what happens here? When is this triggered? Should it than create
			// a whole new TiledImages?
			if (!success) {
				this.tiledImages.removeListeners()
				this.tiledImages = new TiledImages(this.viewer, this.tiledImages.hits, entry, facsimile)
			}
		}
	}

	// private getPayload() {
	// 	const { collection } = this.projectContext.config
	// 	const payload: { size: number, query: any, sort: string, _source: { include: string[] }} = {
	// 		query: null,
	// 		size: 10000,
	// 		sort: collection.sortBy || 'id',
	// 		_source: {
	// 			include: ['id', 'facsimiles']
	// 		}
	// 	}

	// 	if (collection.metadataId == null) {
	// 		payload.query = { match_all: {} }
	// 	} else {
	// 		const metadata = this.entry.metadata.get(collection.metadataId)

	// 		if (metadata == null) return

	// 		if (isHierarchyMetadataItem(metadata)) {
	// 			const term = metadata.value.reduce((prev, curr, index) => {
	// 				prev.push({ term: { [`${collection.metadataId}_level${index}`]: curr }})
	// 				return prev
	// 			}, [])

	// 			payload.query = {
	// 				bool: {
	// 					must: term
	// 				}
	// 			}
	// 		} else if (isListMetadataItem(metadata)) {
	// 			payload.query = {
	// 				term: {
	// 					[metadata.config.id]: metadata.value
	// 				}
	// 			}
	// 		} else if (isRangeMetadataItem(metadata)) {
	// 			payload.query = {
	// 				match_all: {}
	// 			}
	// 		} else {
	// 			console.error('NOT IMPLEMENTED')
	// 			return
	// 		}
	// 	}

	// 	if (collection.sortBy != null) payload.sort = collection.sortBy
	// 	const q = JSON.parse(JSON.stringify(payload.query))
	// 	payload.query.bool = {
	// 		must: q,
	// 		filter: { term: { type: 'zittingsdag' } }
	// 	}

	// 	delete payload.query.term
	// 	return JSON.stringify(payload)
	// }

	/**
	 * Fetch entries from ElasticSearch and create a new TiledImages object
	 * 
	 * @todo move outside controller, when merging with collection-navigator2
	 * 
	 * @todo 2 entries can "share" a scan, so disambiguate, but...
	 * the entry ID has to stay present, because it is needed when a 
	 * user clicks 
	 */
	private async fetchCollectionDocuments(entryId: string): Promise<CollectionDocument[]> {
		const entryApiPath = getEntryApiPath(this.projectContext.config.slug, entryId)
		const url = `${entryApiPath}collection`
		const response = await fetch(url)
		return await response.json()

		// const facsMap = data.hits.hits.reduce((prev: Map<ID, CollectionDocument>, hit: any) => {
		// 	hit._source.facsimiles.forEach((f: ElasticSearchFacsimile) => {
		// 		if (prev.has(f.id)) {
		// 			const cd = prev.get(f.id)
		// 			cd.entryIds.push(hit._source.id)
		// 			prev.set(f.id, cd)
		// 		} else {
		// 			prev.set(f.id, {
		// 				entryIds: [hit._source.id],
		// 				facsimileId: f.id,
		// 				facsimilePath: f.path,
		// 			})
		// 		}
		// 	})
		// 	return prev
		// }, new Map() as Map<ID, CollectionDocument>)

		// return Array.from(facsMap.values())
	}
}
