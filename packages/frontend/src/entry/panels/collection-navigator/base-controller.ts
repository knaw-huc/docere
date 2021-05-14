import { ActiveFacsimile, ProjectAction, ContainerType, ProjectContextValue, Entry } from '@docere/common'
import OpenSeadragon from 'openseadragon';
import TiledImages from './tiled-images'

/**
 * Base class for CollectionNavigator Controller
 * 
 * It should be an abstract class ;(, but TypeScript doesn't handle that well.
 * This class handles the generic part. An instance of it should at least
 * implement an async method `setEntry`
 */
export class CollectionNavigatorBaseController {
	protected tiledImages: TiledImages

	constructor(
		protected viewer: OpenSeadragon.Viewer,
		private dispatch: React.Dispatch<ProjectAction>,
		protected projectContext: ProjectContextValue
	) {
		this.viewer.addHandler('canvas-click', this.canvasClickHandler)
		this.viewer.addHandler('full-screen', this.fullScreenHandler)
	}

	async setEntry(_entry: Entry, _facsimile: ActiveFacsimile) {
		throw new Error(`
			THIS SHOULD BE AN ABSTRACT CLASS WHICH SHOULD BE EXTENDED
			BY A CLASS WHICH IMPLEMENTS THE ASYNC setEntry METHOD!
		`)
	}

	destroy() {
		this.viewer.removeHandler('canvas-click', this.canvasClickHandler)
		this.viewer.removeHandler('full-screen', this.fullScreenHandler)
	}

	setActiveFacsimile(facsimile: ActiveFacsimile) {
		this.tiledImages?.setFacsimile(facsimile)
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
