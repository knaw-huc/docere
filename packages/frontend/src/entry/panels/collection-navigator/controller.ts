import { PanelsProps } from '..';
import { DocereConfig, Entry } from '@docere/common'
import { isHierarchyFacetConfig, isListFacetConfig } from '@docere/search'
import { fetchPost } from '../../../utils';
import ProjectContext from '../../../app/context';
import OpenSeadragon from 'openseadragon';
import TiledImages from './tiled-images'

export default class CollectionNavigatorController {
	private entry: Entry
	private payload: string
	private tiledImages: TiledImages

	constructor(
		private viewer: OpenSeadragon.Viewer,
		private config: DocereConfig['collection'],
		private searchUrl: ProjectContext['searchUrl'],
		private dispatch: PanelsProps['appDispatch'],
	) {
		this.viewer.addHandler('canvas-click', this.canvasClickHandler)
		this.viewer.addHandler('full-screen', this.fullScreenHandler)
	}

	destroy() {
		this.viewer.removeHandler('canvas-click', this.canvasClickHandler)
		this.viewer.removeHandler('full-screen', this.fullScreenHandler)
	}

	setEntry(entry: Entry) {
		this.entry = entry

		const nextPayload = this.getPayload()
		if (nextPayload !== this.payload) {
			this.payload = nextPayload
			this.fetchCollectionDocuments()
		} else {
			const success = this.tiledImages.setEntry(entry)
			if (!success) {
				this.tiledImages.removeListeners()
				this.tiledImages = new TiledImages(this.viewer, this.tiledImages.hits, entry)
			}
		}
	}

	private canvasClickHandler = (event: OpenSeadragon.ViewerEvent) => {
		// TODO what does quick do/tell?
		if (!event.quick) return

		const id = this.tiledImages.getEntryFromMousePosition(event.position)

		if (id != null) this.dispatch({ type: 'SET_ENTRY_ID', id })
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
			} else {
				console.error('NOT IMPLEMENTED')
				return
			}
		}

		if (this.config.sortBy != null) payload.sort = this.config.sortBy

		return JSON.stringify(payload)
	}

	private async fetchCollectionDocuments() {
		const data = await fetchPost(this.searchUrl, this.payload)
		this.tiledImages = new TiledImages(this.viewer, data.hits.hits, this.entry)
	}
}
