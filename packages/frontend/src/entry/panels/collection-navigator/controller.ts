import { ProjectContext, fetchPost, ActiveFacsimile, ID, Hit } from '@docere/common'
import { isHierarchyFacetConfig, isListFacetConfig, isRangeFacetConfig } from '@docere/search'
import OpenSeadragon from 'openseadragon';
import TiledImages from './tiled-images'

import type { DocereConfig, Entry } from '@docere/common'

export type CollectionDocument = { id: ID, facsimiles: Hit['facsimiles'] }

export default class CollectionNavigatorController {
	private entry: Entry
	private payload: string
	private tiledImages: TiledImages

	constructor(
		private viewer: OpenSeadragon.Viewer,
		private config: DocereConfig['collection'],
		private searchUrl: ProjectContext['searchUrl'],
		private handleClick: (entryId: string, facsimilePath: string) => void
	) {
		this.viewer.addHandler('canvas-click', this.canvasClickHandler)
		this.viewer.addHandler('full-screen', this.fullScreenHandler)
	}

	destroy() {
		this.viewer.removeHandler('canvas-click', this.canvasClickHandler)
		this.viewer.removeHandler('full-screen', this.fullScreenHandler)
	}

	setActiveFacsimile(facsimile: ActiveFacsimile) {
		this.tiledImages?.setActiveFacsimile(facsimile)
	}

	async setEntry(entry: Entry, facsimile: ActiveFacsimile) {
		this.entry = entry

		const nextPayload = this.getPayload()
		if (nextPayload !== this.payload) {
			this.payload = nextPayload
			const entries = await this.fetchCollectionDocuments()
			this.tiledImages?.removeListeners()
			this.tiledImages = new TiledImages(this.viewer, entries, this.entry, facsimile)
		} else {
			const success = this.tiledImages.setEntry(entry, facsimile)
			if (!success) {
				this.tiledImages.removeListeners()
				this.tiledImages = new TiledImages(this.viewer, this.tiledImages.hits, entry, facsimile)
			}
		}
	}

	private canvasClickHandler = (event: OpenSeadragon.ViewerEvent) => {
		// TODO what does quick do/tell?
		if (!event.quick) return

		const { entryId, facsimileId } = this.tiledImages.getEntryFromMousePosition(event.position)
		this.handleClick(entryId, facsimileId)
	}

	private fullScreenHandler = (event: OpenSeadragon.ViewerEvent) => {
		if (event.fullScreen) {
			// @ts-ignore
			this.viewer.gestureSettingsMouse.scrollToZoom = true
			// @ts-ignore
			this.viewer.panVertical = true
		} else {
			// @ts-ignore
			this.viewer.gestureSettingsMouse.scrollToZoom = false
			// @ts-ignore
			this.viewer.panVertical = false
		}

		setTimeout(() => this.tiledImages.center(), 0)
	}

	private getPayload() {
		const payload: { size: number, query: any, sort: string, _source: { include: string[] }} = {
			query: null,
			size: 10000,
			sort: this.config.sortBy || 'id',
			_source: {
				include: ['id', 'facsimiles']
			}
		}

		if (this.config.metadataId == null) {
			payload.query = { match_all: {} }
		} else {
			const metadata = this.entry.metadata.find(md => md.id === this.config.metadataId)

			if (metadata == null) return

			if (isHierarchyFacetConfig(metadata)) {
				const term = metadata.value.reduce((prev, curr, index) => {
					prev.push({ term: { [`${this.config.metadataId}_level${index}`]: curr }})
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

		if (this.config.sortBy != null) payload.sort = this.config.sortBy

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
	private async fetchCollectionDocuments(): Promise<CollectionDocument[]> {
		const data = await fetchPost(this.searchUrl, this.payload)
		return data.hits.hits.map((h: any) => h._source)
	}
}
