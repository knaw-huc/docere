import OpenSeadragon from 'openseadragon';

import { Entry, ActiveFacsimile, Colors, ID } from '@docere/common';
import { CollectionDocument } from './controller';

interface TiledImageOptions {
	bounds: OpenSeadragon.Rect
	index: number
	tileSource: string
	userData: CollectionDocument
}

const ACTIVE_FACSIMILE_OVERLAY_ID = 'active_facsimile_overlay'

export default class TiledImages {
	private activeFacsimile: ActiveFacsimile
	// The bounds of the currently loaded thumbs
	private loadedBounds = new OpenSeadragon.Rect(0, 0, 0, 0)

	// Map of options for OpenSeadragon.TiledImage
	private tileOptions: TiledImageOptions[] = []
	private activeTileOptions: TiledImageOptions[] = []

	// Flags to remember if tiles are being loaded and if there is a queue.
	// The queue flag is set when the user pans while thumbs are being loaded.
	private isLoadingTiles = false
	private hasQueue = false

	private startIndex: number
	private rightIndex: number
	private leftIndex: number
	private currentIndex: number

	private entry: Entry

	// Keep track of which facsimile has an overlay
	private currentOverlay: ID

	constructor(
		private viewer: OpenSeadragon.Viewer,
		public hits: CollectionDocument[],
		entry: Entry,
		facsimile: ActiveFacsimile
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

	private tileLoadFailedHandler = () => {
		this.addTiledImage()
	}

	// Set the active options from this.entry.facsimiles. Used to calculate this.startIndex and this.highlightActive
	setActiveOptions() {
		this.activeTileOptions = this.tileOptions.filter(
			option => option.userData.entryIds.has(this.entry.id)
		)
	}

	setActiveFacsimile(facsimile?: ActiveFacsimile) {
		if (facsimile == null && this.currentOverlay !== this.activeFacsimile?.props._facsimileId) {
			facsimile = this.activeFacsimile
		}
		this.activeFacsimile = facsimile
		if (this.activeFacsimile == null) return

		const activeTileOption = this.activeTileOptions.find(to => to.tileSource === facsimile.props._facsimilePath)
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

		this.currentOverlay = this.activeFacsimile.props._facsimileId
	}

	// Set a new entry. When this.highlightActive returns false, not all tiles of that entry are loaded.
	// The controller will than initiate a new TiledImages with that entry as centre for loading tiles.
	// TiledImages can only load consecutive images (next on left or next on the right), so when there is
	// a gap between the currently loaded tiles and the requested tiles, we start all over again. 
	setEntry(entry: Entry, facsimile: ActiveFacsimile) {
		this.entry = entry
		this.setActiveOptions()
		this.setActiveFacsimile(facsimile)
	}

	getEntryFromMousePosition(mousePosition: OpenSeadragon.Point): TiledImageOptions['userData'] {
		// Convert mouse pixel position to viewport coordinates
		const point = this.viewer.viewport.pointFromPixel(mousePosition)

		// Find the option with the bound that contain the clicked point
		const clickedTiledImageOption = this.tileOptions.find(option => option.bounds?.containsPoint(point))
		if (clickedTiledImageOption == null) return null

		// Return the entry ID
		return clickedTiledImageOption.userData
	}

	center() {
		const bounds = this.activeTileOptions.reduce((prev, curr) => {
			if (prev == null) return curr.bounds
			return prev.union(curr.bounds)
		}, null as OpenSeadragon.Rect)

		if (bounds == null) return false
		this.viewer.viewport.fitBounds(bounds)

		return bounds
	}

	removeListeners() {
		this.viewer.removeHandler('animation-finish', this.animationFinishHandler)
		this.viewer.addHandler('add-item-failed', this.tileLoadFailedHandler)
		this.viewer.world.removeHandler('add-item', this.addItemHandler)
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

	// Remove tiles currently loaded in OpenSeadragon.World
	private removeTiledImages() {
		const count = this.viewer.world.getItemCount();
		for (let i = count; i > 0; i--) {
			const tiledImage = this.viewer.world.getItemAt(i - 1);
			this.viewer.world.removeItem(tiledImage)
		}
	}

	// Set the tiled image options. Every entry (_source) can have multiple
	// facsimiles, which means there can be more thumbs than entries.
	// The search result (hits) is 'reduced' to tiled image options.
	// The options are build prior to loading thumbs, because the order of the
	// thumbs needs to be known in advance.
	private setOptions(hits: CollectionDocument[]) {
		this.tileOptions = hits.map((collectionDocument, index) => ({
			bounds: null,
			index,
			tileSource: collectionDocument.facsimilePath,
			userData: collectionDocument,
		}))
	}

	// If an animation is finished (pan, zoom, etc) check if thumbs have to be loaded.
	// When images are already being loaded, flag there is a queue, otherwise check if 
	// new thumbs should be loaded
	private animationFinishHandler = () => {
		if (this.isLoadingTiles) this.hasQueue = true
		else this.addTiledImage()
	}

	// Calculate if there is space on the left and/or right side of this.loadedBounds to
	// add more thumbs
	private hasSpace(viewportBounds: OpenSeadragon.Rect) {
		const right = this.loadedBounds.x + this.loadedBounds.width < viewportBounds.x + viewportBounds.width * 2
		const left = this.loadedBounds.x > viewportBounds.x - viewportBounds.width
		return [left, right]
	}

	// Handler for when a new tile is added to OpenSeadragon.World.
	// The tile is placed at Point(0,0) so it has to be moved to the 
	// available space on the left or right side of the current thumbs
	private addItemHandler = (ev: OpenSeadragon.WorldEvent) => {
		const tiledImage = ev.item as OpenSeadragon.TiledImage
		tiledImage.setHeight(1)

		// console.log(this.startIndex, this.leftIndex, this.rightIndex, this.currentIndex)

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

	// Initiate a new tile, either on the left or the right side of the start index,
	// depending on if there is space (ie the required thumbs aren't already loaded),
	// which tile (left or right) was loaded last and of course if there are more
	// tiles to load (0 < index < options.length)
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
			this.setActiveFacsimile()
			if (this.hasQueue) {
				this.hasQueue = false
				this.addTiledImage()
			}
		}
	}
}
