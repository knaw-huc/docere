import { PanelsProps } from '..';
import { DocereConfig, Entry, Hit } from '@docere/common'
import { isHierarchyFacetConfig } from '@docere/search_'
import { fetchPost } from '../../../utils';
import ProjectContext from '../../../app/context';

export default class CollectionNavigatorController {
	private activeFacsimilePaths: string[] = []
	private entry: Entry
	private payload: string
	private tiledImageOptions: { tileSource: string, userData: any }[]

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
		this.setActiveFacsimilePaths()

		const nextPayload = this.getPayload()
		if (nextPayload !== this.payload) {
			this.payload = nextPayload
			this.fetchCollectionDocuments()
		} else {
			this.highlightActiveTiledImages()
		}
	}

	private canvasClickHandler = (event: OpenSeadragon.ViewerEvent) => {
		// TODO what does quick do/tell?
		if (!event.quick) return

		const index = this.findClickedTiledImageIndex(event.position)

		if (index !== -1) {
			const tileSource = this.tiledImageOptions[index]
			this.dispatch({ type: 'SET_ENTRY_ID', id: tileSource.userData.id })
		}
	}

	private fullScreenHandler = (event: OpenSeadragon.ViewerEvent) => {
		if (event.fullScreen) {
			this.viewer.gestureSettingsMouse.scrollToZoom = true
			this.viewer.panVertical = true
		} else {
			this.viewer.gestureSettingsMouse.scrollToZoom = false
			this.viewer.panVertical = false
		}

		this.highlightActiveTiledImages()
	}


	private highlightActiveTiledImages() {
		this.viewer.clearOverlays()

		const unionBounds = this.activeFacsimilePaths
			.map(path => this.tiledImageOptions.findIndex(option => option.tileSource === path))
			.reduce((prev, curr) => {
				const item = this.viewer.world.getItemAt(curr)
				const bounds = item.getBounds()
				return prev == null ? bounds : prev.union(bounds)
			}, null as any)


		const element = document.createElement("div")
		element.style.border = '3px solid orange'
		element.style.boxSizing = 'border-box'

		this.viewer.addOverlay({
			checkResize: false,
			element,
			location: unionBounds,
		})

		this.viewer.viewport.fitBounds(unionBounds)
	}

	private setActiveFacsimilePaths() {
		this.activeFacsimilePaths = this.entry.facsimiles.reduce((prev, curr) => {
			const ps = curr.versions.map(v => v.path)
			return prev.concat(ps)
		}, [] as string[])
	}

	private getPayload() {
		if (this.config.metadataId == null) {
			return JSON.stringify({
				size: 10000,
				query: {
					match_all: {}
				},
				sort: this.config.sortBy
			})
		}

		const metadata = this.entry.metadata.find(md => md.id === this.config.metadataId)

		if (metadata != null && isHierarchyFacetConfig(metadata)) {
			const term = metadata.value.reduce((prev, curr, index) => {
				prev.push({ term: { [`${this.config.metadataId}_level${index}`]: curr }})
				return prev
			}, [])

			return JSON.stringify({
				"size": 10000,
				"query": {
					"bool": {
						"must": term
					}
				},
				"sort": this.config.sortBy,
			})
		} else {
			console.error('NOT IMPLEMENTED')
		}
	}

	private async fetchCollectionDocuments() {
		const data = await fetchPost(this.searchUrl, this.payload)
		this.setTiledImageOptions(data.hits.hits)
		this.addTiledImages()
	}

	private setTiledImageOptions(hits: Hit[]) {
		this.tiledImageOptions = hits.reduce((prev, curr /*, index */) => {
			curr._source.facsimiles.forEach((f: string) => {
				prev.push({
					tileSource: f,
					userData: curr._source,
				})
			})
			return prev
		}, [])
	}

	private addTiledImages() {
		const self = this
		let count = 0

		function addItemHandler() {
			count += 1
			if (count === self.tiledImageOptions.length) {
				self.arrangeTiledImages()
				self.highlightActiveTiledImages()
				self.viewer.world.removeHandler('add-item', addItemHandler)
				self.viewer.removeHandler('add-item-failed', addItemHandler)
			}
		}

		this.viewer.world.addHandler('add-item', addItemHandler)
		this.viewer.addHandler('add-item-failed', addItemHandler)

		this.clearTiledImages()
		this.tiledImageOptions.forEach(option => this.viewer.addTiledImage(option))
	}

	private findClickedTiledImageIndex(mousePosition: OpenSeadragon.Point) {
		// Convert mouse pixel position to viewport coordinates
		const point = this.viewer.viewport.pointFromPixel(mousePosition)

		// Loop over the tiled images until click image is found
		const count = this.viewer.world.getItemCount()
		for (let i = 0; i < count; i++) {
			const bounds = this.viewer.world.getItemAt(i).getBounds()
			if (point.x > bounds.x && 
				point.y > bounds.y && 
				point.x < bounds.x + bounds.width &&
				point.y < bounds.y + bounds.height) {
				return i
			}
		}

		return -1
	}

	private arrangeTiledImages() {
		const count = this.viewer.world.getItemCount();
		let x = 0
		for (let i = 0; i < count; i++) {
			const tiledImage = this.viewer.world.getItemAt(i);
			tiledImage.setHeight(1)
			const bounds = tiledImage.getBounds()
			bounds.x = x + (i * .1)
			tiledImage.fitBounds(bounds)
			x = x + bounds.width
		}
	}

	private clearTiledImages() {
		const count = this.viewer.world.getItemCount();
		for (let i = count; i > 0; i--) {
			const tiledImage = this.viewer.world.getItemAt(i - 1);
			this.viewer.world.removeItem(tiledImage)
		}
	}
}
