import { ActiveFacsimile, ID, ProjectAction, ContainerType } from '@docere/common'
import OpenSeadragon from 'openseadragon'
import TiledImages from './tiled-images'

import type { Entry } from '@docere/common'

export type CollectionDocument = {
	entryIds: Set<ID>,
	facsimileId: string,
	facsimilePath: string
}

export default class CollectionNavigatorController {
	// private entry: Entry
	// private payload: string
	private tiledImages: TiledImages

	constructor(
		private viewer: OpenSeadragon.Viewer,
		// private config: DocereConfig['collection'],
		// private searchUrl: ProjectContextValue['searchUrl'],
		private dispatch: React.Dispatch<ProjectAction>
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
		// this.entry = entry

		const hits: CollectionDocument[] = Array.from(entry.textData.facsimiles.values())
			.map(f => ({
				entryIds: new Set([entry.id]),
				facsimileId: f.id,
				facsimilePath: f.versions[0].path
			}))
		this.tiledImages = new TiledImages(this.viewer, hits, entry, facsimile)
	}

	private canvasClickHandler = (event: OpenSeadragon.ViewerEvent) => {
		// TODO what does quick do/tell?
		if (!event.quick) return

		const mousePosData = this.tiledImages.getEntryFromMousePosition(event.position)
		if (mousePosData == null) return

		const { entryIds, facsimileId } = mousePosData 
		const entryId = entryIds.values().next().value
		
		this.dispatch({
			type: 'SET_ENTRY_ID',
			setEntry: {
				entryId,
				facsimileId,
				triggerContainer: ContainerType.CollectionNavigator,
			}
		})
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
