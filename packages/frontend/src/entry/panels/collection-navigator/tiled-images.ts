import OpenSeadragon from 'openseadragon'

import { Entry, ActiveFacsimile, Colors, ID } from '@docere/common'
import { CollectionDocument } from './collection-controller'

interface TiledImageOptions {
	bounds: OpenSeadragon.Rect
	index: number
	tileSource: string
	userData: CollectionDocument
}

const ACTIVE_FACSIMILE_OVERLAY_ID = 'active_facsimile_overlay'
const ACTIVE_ENTRY_OVERLAY_ID = 'active_entry_overlay'

export default class TiledImages {
	/** The facsimile currently visible in the facsimile panel */
	private activeFacsimile: ActiveFacsimile

	/** The bounds of the currently loaded thumbs */
	private loadedBounds = new OpenSeadragon.Rect(0, 0, 0, 0)

	/** List of tile options. A tile represents a facsimile */
	private tileOptions: TiledImageOptions[] = []

	/** List of active tile options */
	private activeTileOptions: TiledImageOptions[] = []

	/**
	 * Flags to remember if tiles are being loaded and if there is a queue.
	 * The queue flag is set when the user pans while thumbs are being loaded.
	 */
	private isLoadingTiles = false
	private hasQueue = false

	private startIndex: number
	private rightIndex: number
	private leftIndex: number
	private currentIndex: number

	private entry: Entry

	// Keep track of which facsimile is currently active
	// and thus has an orange border drawn around it
	private activeFacsimileID: ID

	constructor(
		private viewer: OpenSeadragon.Viewer,
		public hits: CollectionDocument[],
		entry: Entry,
		facsimile: ActiveFacsimile,
		 
		/**
		 * Highlight the facsimiles that are part of the current entry.
		 * When using the TiledImages as a collection navigator that is useful,
		 * but when using the TiledImages as a overview of the facsimiles within
		 * an entry, not so much.
		 */
		private highlightEntryFacsimiles = true
	) {
		// Add event handlers
		this.viewer.world.addHandler('add-item', this.addItemHandler)
		this.viewer.addHandler('add-item-failed', this.tileLoadFailedHandler)
		this.viewer.addHandler('animation-finish', this.animationFinishHandler)

		this.removeTiledImages()
		this.setOptions(this.hits)
		this.setEntry(entry, facsimile)
		this.init()
	}

	/**
	 * Set a new entry. 
	 * 
	 * When this.highlightActive returns false, not all tiles of that entry are loaded.
	 * The controller will than initiate a new TiledImages with that entry as centre for
	 * loading tiles. TiledImages can only load consecutive images (next on left or next
	 * on the right), so when there is a gap between the currently loaded tiles and the 
	 * requested tiles, we start all over again. 
	 * 
	 * @param entry 
	 * @param facsimile 
	 * @returns 
	 */
	setEntry(entry: Entry, facsimile: ActiveFacsimile) {
		this.entry = entry

		// Set the active options from this.entry.facsimiles. Used to calculate
		// this.startIndex and this.highlightActive
		this.activeTileOptions = this.tileOptions.filter(
			option => option.userData.entryIds.has(this.entry.id)
		)

		this.setFacsimile(facsimile)

		// If highlightEntryFacsimiles is not set, don't
		// this.hightlightActiveEntryFacsimiles (duh) and return true.
		// Without true the whole TiledImages will be destroyed and re-created
		// TODO refactor :)
		return this.highlightEntryFacsimiles ?
			this.highlightActiveEntryFacsimiles()	:
			true
	}


	/**
	 * Set and highlight the active facsimile by adding a HTMLDivElement as an overlay
	 * with an orange border
	 * 
	 * @param facsimile 
	 * @returns 
	 */
	setFacsimile(facsimile?: ActiveFacsimile) {
		if (
			facsimile == null &&
			this.activeFacsimileID !== this.activeFacsimile?.props._facsimileId
		) {
			facsimile = this.activeFacsimile
		}
		this.activeFacsimile = facsimile
		if (this.activeFacsimile == null) return

		const activeTileOption = this.activeTileOptions
			.find(to => to.tileSource === facsimile.props._facsimilePath)
		if (activeTileOption == null || activeTileOption.bounds == null) return

		this.viewer.removeOverlay(ACTIVE_FACSIMILE_OVERLAY_ID)

		const element = document.createElement("div")
		element.id = ACTIVE_FACSIMILE_OVERLAY_ID
		element.style.border = `3px solid ${Colors.Orange}`
		element.style.boxSizing = 'border-box'

		this.viewer.addOverlay({
			checkResize: false,
			element,
			location: activeTileOption.bounds,
		})

		this.viewer.viewport.fitBounds(activeTileOption.bounds)

		this.activeFacsimileID = this.activeFacsimile.props._facsimileId
	}

	/**
	 * Returns the {@link CollectionDocument} of the tile clicked
	 * 
	 * @param mousePosition 
	 * @returns
	 */
	getEntryFromMousePosition(mousePosition: OpenSeadragon.Point): TiledImageOptions['userData'] {
		// Convert mouse pixel position to viewport coordinates
		const point = this.viewer.viewport.pointFromPixel(mousePosition)

		// Find the option with the bound that contain the clicked point
		const clickedTiledImageOption = this.tileOptions.find(option => option.bounds?.containsPoint(point))
		if (clickedTiledImageOption == null) return null

		return clickedTiledImageOption.userData
	}

	/**
	 * Center on the active tiles/facsimiles
	 * 
	 * @returns 
	 */
	center() {
		const bounds = this.activeTileOptions.reduce((prev, curr) => {
			if (prev == null) return curr.bounds
			return prev.union(curr.bounds)
		}, null as OpenSeadragon.Rect)

		if (bounds == null) return false
		this.viewer.viewport.fitBounds(bounds)

		return bounds
	}

	/**
	 * Remove the event listeners
	 * 
	 * There are two instances when the listeners are removed:
	 * 1. all the tiled images have been loaded
	 * 2. the TiledImages object is destroyed
	 */
	removeListeners() {
		this.viewer.removeHandler('animation-finish', this.animationFinishHandler)
		this.viewer.addHandler('add-item-failed', this.tileLoadFailedHandler)
		this.viewer.world.removeHandler('add-item', this.addItemHandler)

		if (this.highlightEntryFacsimiles) {
			this.viewer.world.removeHandler('add-item', this.highlightActiveEntryFacsimiles)
		}
	}

	private init() {
		if (!this.activeTileOptions.length) return

		// start = index of the current tiled image / first active facsimile
		this.startIndex = this.activeTileOptions[0].index

		// current = alternates between the left and right index
		this.currentIndex = this.startIndex
		// right = index of the thumb to load on the right side of the start index
		this.rightIndex = this.startIndex
		// left = index of the thumb to load on the left side of the start index
		this.leftIndex = this.startIndex + 1
		// For the first iteration to start on the start index we increase the left index by 1:
		// to start on the left, the right index has to equal the start index, than the left index
		// is decreased by 1 (which is the start index), see this.addTiledImage

		// Start the iterations of adding tiled images to the collection navigator
		this.addTiledImage()
	}

	/**
	 * Highlight the facsimiles of the active entry. The highlight is a transparent
	 * light blue covering the facsimile thumb.
	 * 
	 * If need be, wait for the tiles to be
	 * loaded. Returns true when the highlight is directly set and false when via
	 * event listener, this is used to determine if a new TiledImages object needs
	 * to be created from the controller (see {@link TiledImages.setEntry}). 
	 * 
	 * @returns 
	 */
	private highlightActiveEntryFacsimiles = () => {
		// Remove the handler is present, it is being re-created everytime one of 
		// the tiles is not loaded yet
		this.viewer.world.removeHandler('add-item', this.highlightActiveEntryFacsimiles)

		if (this.activeTileOptions.some(option => option.bounds == null)) {
			this.viewer.world.addHandler('add-item', this.highlightActiveEntryFacsimiles)
			return false
		}

		this.viewer.removeOverlay(ACTIVE_ENTRY_OVERLAY_ID)

		const bounds = this.center()

		const element = document.createElement("div")
		element.id = ACTIVE_ENTRY_OVERLAY_ID
		element.style.boxSizing = 'border-box'
		element.style.backgroundColor = `${Colors.BlueBright}44`

		this.viewer.addOverlay({
			checkResize: false,
			element,
			location: bounds,
		})

		if (this.viewer.getOverlayById(ACTIVE_FACSIMILE_OVERLAY_ID) == null && this.activeFacsimile != null) {
 			this.setFacsimile(this.activeFacsimile)
		}

		return true
	}

	/**
	 * Remove tiles currently loaded in OpenSeadragon.World
	 */
	private removeTiledImages() {
		const count = this.viewer.world.getItemCount();
		for (let i = count; i > 0; i--) {
			const tiledImage = this.viewer.world.getItemAt(i - 1);
			this.viewer.world.removeItem(tiledImage)
		}
	}

	/**
	 * Set the tiled image options. Every entry (_source) can have multiple
	 * facsimiles, which means there can be more thumbs than entries.
	 * The search result (hits) is 'reduced' to tiled image options.
	 * The options are build prior to loading thumbs, because the order of the
	 * thumbs needs to be known in advance.
	 * 
	 * @param hits 
	 */
	private setOptions(hits: CollectionDocument[]) {
		this.tileOptions = hits.map((collectionDocument, index) => ({
			bounds: null,
			index,
			tileSource: collectionDocument.facsimilePath,
			userData: collectionDocument,
		}))
	}

	/**
	 * If an animation is finished (pan, zoom, etc) check if thumbs have to be loaded.
	 * When images are already being loaded, flag there is a queue, otherwise check if 
	 * new thumbs should be loaded
	 */
	private animationFinishHandler = () => {
		if (this.isLoadingTiles) this.hasQueue = true
		else this.addTiledImage()
	}

	/**
	 * Calculate if there is space on the left and/or right side of this.loadedBounds
	 * to add more thumbs
	 */
	private hasSpace(viewportBounds: OpenSeadragon.Rect) {
		const right = this.loadedBounds.x + this.loadedBounds.width < viewportBounds.x + viewportBounds.width * 2
		const left = this.loadedBounds.x > viewportBounds.x - viewportBounds.width
		return [left, right]
	}

	/**
	 * Handler for when a new tile is added to {@link OpenSeadragon.World}.
	 * The tile is placed at Point(0,0) so it has to be moved to the 
	 * available space on the left or right side of the current thumbs
	 * 
	 * @param ev 
	 * @returns 
	 */
	private addItemHandler = (ev: OpenSeadragon.WorldEvent) => {
		const tiledImage = ev.item as OpenSeadragon.TiledImage
		tiledImage.setHeight(1)

		let position: OpenSeadragon.Point
		// Set position to the left side
		if (this.currentIndex === this.leftIndex) {
			let x = this.loadedBounds.x - tiledImage.getBounds().width
			// Add .1 when it's not the first tile
			if (this.currentIndex !== this.startIndex) x = x - .1 
			position = new OpenSeadragon.Point(x, 0)
		}
		// Set position to the right side
		else if (this.currentIndex === this.rightIndex) {
			let x = this.loadedBounds.x + this.loadedBounds.width + .1
			position = new OpenSeadragon.Point(x, 0)
		// This should never happen :fingers-crossed:
		} else {
			console.log('SOME ERROR should not occur', this.currentIndex)
			return
		}
		tiledImage.setPosition(position)

		// Update the loaded bounds, because of the new thumb, the bounds
		// have become wider, either on the left or right side
		const tiledImageBounds = tiledImage.getBounds()
		this.tileOptions[this.currentIndex].bounds = tiledImageBounds
		this.loadedBounds = this.loadedBounds == null ? tiledImageBounds : this.loadedBounds.union(tiledImageBounds)

		// When the first tile is loaded, fit viewport to the bounds of the tile
		if (this.currentIndex === this.startIndex) this.viewer.viewport.fitBounds(tiledImageBounds)				

		// If the left index is 0 and the right index is at the end of the options array,
		// there are no more tiles to load, so we can remove the event listeners
		if (this.leftIndex === 0 && this.rightIndex === this.tileOptions.length - 1) {
			this.removeListeners()
		}

		// When the current tile is placed correctly, initiate the next tile to load
		this.addTiledImage()
	}

	/**
	 * Initiate a new tile, either on the left or the right side of the start index,
	 * depending on if there is space (ie the required thumbs aren't already loaded),
	 * which tile (left or right) was loaded last and of course if there are more
	 * tiles to load (0 < index < options.length)
	 */
	private addTiledImage = () => {
		this.isLoadingTiles = true
		const viewportBounds = this.viewer.viewport.getBounds()
		const [hasLeftSpace, hasRightSpace] = this.hasSpace(viewportBounds)

		const leftGo = hasLeftSpace && this.leftIndex > 0
		const rightGo = hasRightSpace && this.rightIndex < this.tileOptions.length - 1

		// Load tile on the left
		if (leftGo && (this.currentIndex === this.rightIndex || !rightGo)) {
			this.leftIndex = this.leftIndex - 1
			this.currentIndex = this.leftIndex
			this.viewer.addTiledImage({
				tileSource: this.tileOptions[this.leftIndex].tileSource,
				x: viewportBounds.x - 2,
			})
		}
		// Load tile on the right
		else if (rightGo && (this.currentIndex === this.leftIndex || !leftGo)) {
			this.rightIndex = this.rightIndex + 1
			this.currentIndex = this.rightIndex
			this.viewer.addTiledImage({
				tileSource: this.tileOptions[this.rightIndex].tileSource,
				x: viewportBounds.x + viewportBounds.width + 2,
			})
		// No more tiles to load for now. When the user pans, space becomes available
		// on the left or right side and more tiles will be loaded
		} else {
			this.isLoadingTiles = false
			this.setFacsimile()
			if (this.hasQueue) {
				this.hasQueue = false
				this.addTiledImage()
			}
		}
	}

	/**
	 * When a tile fails move to the next
	 */
	private tileLoadFailedHandler = () => {
		this.addTiledImage()
	}
}
