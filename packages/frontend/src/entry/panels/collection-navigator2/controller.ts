import { Facsimile, FacsimileLayer, Entry } from '@docere/common'
import OpenSeadragon from 'openseadragon';
import TiledImages from './tiled-images'

export default class CollectionNavigatorController {
	private tiledImages: TiledImages

	constructor(
		private viewer: OpenSeadragon.Viewer,
		entry: Entry,
		layer: FacsimileLayer,
		private handleClick: (id: string) => void
	) {
		this.viewer.addHandler('canvas-click', this.canvasClickHandler)
		this.viewer.addHandler('full-screen', this.fullScreenHandler)

	 	this.tiledImages = new TiledImages(this.viewer, entry, layer)
	}

	destroy() {
		this.tiledImages.removeListeners()
		this.viewer.removeHandler('canvas-click', this.canvasClickHandler)
		this.viewer.removeHandler('full-screen', this.fullScreenHandler)
	}

	setActiveFacsimile(facsimile: Facsimile) {
		this.tiledImages.setActiveFacsimile(facsimile)
	}

	private canvasClickHandler = (event: OpenSeadragon.ViewerEvent) => {
		// TODO what does quick do/tell?
		if (!event.quick) return

		const id = this.tiledImages.getEntryFromMousePosition(event.position)
		if (id != null) this.handleClick(id)
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
}
