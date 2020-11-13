import OpenSeadragon from 'openseadragon';

import { Facsimile, Entry, FacsimileLayer, indexOfIterator } from '@docere/common';
import { formatTileSource } from '../facsimile/utils';

interface TiledImageOptions {
	bounds: OpenSeadragon.Rect
	index: number
	tileSource: string | Record<string, any>
	userData: any
}

export default class TiledImages {
	private activeFacsimile: Facsimile

	/** The bounds of the currently loaded thumbs */
	private loadedBounds = new OpenSeadragon.Rect(0, 0, 0, 0)

	/** Map of options for OpenSeadragon.TiledImage */
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

	// TODO activeFacsimile should/could be present at loading TiledImages
	constructor(
		private viewer: OpenSeadragon.Viewer,
		private entry: Entry,
		private layer: FacsimileLayer
	) {
		// Add event handlers
		this.viewer.world.addHandler('add-item', this.addItemHandler)
		this.viewer.addHandler('add-item-failed', this.tileLoadFailedHandler)
		this.viewer.addHandler('animation-finish', this.animationFinishHandler)

		this.removeTiledImages()
		this.setOptions()

		this.init()
	}

	private tileLoadFailedHandler = () => {
		this.addTiledImage()
	}

	setActiveFacsimile(facsimile: Facsimile) {
		this.activeFacsimile = facsimile
		this.setActiveOptions()
		this.highlightActiveTiles()	
	}

	// Set the active options from this.entry.facsimiles. Used to calculate this.startIndex and this.highlightActive
	setActiveOptions() {
		this.activeTileOptions = this.tileOptions
			.filter(option => {
				return option.tileSource === formatTileSource(this.activeFacsimile)
			})
	}

	// Set a new entry. When this.highlightActive returns false, not all tiles of that entry are loaded.
	// The controller will than initiate a new TiledImages with that entry as centre for loading tiles.
	// TiledImages can only load consecutive images (next on left or next on the right), so when there is
	// a gap between the currently loaded tiles and the requested tiles, we start all over again. 
	// setEntry(entry: Entry) {
	// 	this.entry = entry
	// 	this.setActiveOptions()
	// 	return this.highlightActiveTiles()	
	// }

	getEntryFromMousePosition(mousePosition: OpenSeadragon.Point) {
		// Convert mouse pixel position to viewport coordinates
		const point = this.viewer.viewport.pointFromPixel(mousePosition)

		// Find the option with the bound that contain the clicked point
		const clickedTiledImageOption = this.tileOptions.find(option => option.bounds?.containsPoint(point))

		// Return the entry ID
		return clickedTiledImageOption?.userData.id
	}

	center() {
		const bounds = this.activeTileOptions.reduce((prev, curr) => {
			if (prev == null) return curr.bounds
			return prev.union(curr.bounds)
		}, null as OpenSeadragon.Rect)

		if (bounds == null) return null
		this.viewer.viewport.fitBounds(bounds)

		return bounds
	}

	removeListeners() {
		this.viewer.removeHandler('animation-finish', this.animationFinishHandler)
		this.viewer.removeHandler('add-item-failed', this.tileLoadFailedHandler)
		this.viewer.world.removeHandler('add-item', this.addItemHandler)
		this.viewer.world.removeHandler('add-item', this.highlightActiveTiles)
	}

	private init() {
		// start = index of the current tiled image / first active facsimile
		this.startIndex = this.activeFacsimile == null ?
			0 :
			indexOfIterator(this.layer.facsimiles, this.activeFacsimile.id)
			// this.facsimiles.findIndex(f => f.id === this.activeFacsimile.id)

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
	 * Add the highlight overlay
	 */
	private addHighlightOverlay() {
		this.viewer.clearOverlays()

		const bounds = this.center()

		const element = document.createElement("div")
		element.style.border = '3px solid orange'
		element.style.boxSizing = 'border-box'

		this.viewer.addOverlay({
			checkResize: false,
			element,
			location: bounds,
		})
	}

	/**
	 * Highlights the active tiled images. If need be, wait for the tiles to be loaded
	 * Returns true when the highlight is directly set and false when via event listener,
	 * this is used to determine if a new TiledImages object needs to be created from
	 * the controller (see this.setEntry). 
	 */
	private highlightActiveTiles = () => {
		// Remove the handler is present, it is being re-created everytime one of 
		// the tiles is not loaded yet
		this.viewer.world.removeHandler('add-item', this.highlightActiveTiles)

		if (this.activeTileOptions.some(option => option.bounds == null)) {
			this.viewer.world.addHandler('add-item', this.highlightActiveTiles)
			return false
		}

		this.addHighlightOverlay()
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
	 */
	private setOptions() {
		this.tileOptions = []
		let index = 0
		for (const facsimileId of this.layer.facsimiles) {
			const facsimile = this.entry.textData.facsimiles.get(facsimileId)
			let tileSource = formatTileSource(facsimile)

			// @ts-ignore
			if (tileSource.hasOwnProperty('tileSource')) tileSource = tileSource.tileSource

			this.tileOptions.push({
				bounds: null,
				index,
				tileSource, //.versions[0].path,
				userData: facsimile
			})
			index++
		}
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
	 * Calculate if there is space on the left and/or right side of this.loadedBounds to
	 * add more thumbs
	 * 
	 * @param viewportBounds
	 * @return [number, number]
	 */
	private hasSpace(viewportBounds: OpenSeadragon.Rect) {
		const right = this.loadedBounds.x + this.loadedBounds.width < viewportBounds.x + viewportBounds.width * 2
		const left = this.loadedBounds.x > viewportBounds.x - viewportBounds.width
		return [left, right]
	}

	/**
	 * 
	 * Handler for when a new tile is added to OpenSeadragon.World.
	 * The tile is placed at Point(0,0) so it has to be moved to the 
	 * available space on the left or right side of the current thumbs
	 * 
	 * @param ev
	 */
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
			if (this.hasQueue) {
				this.hasQueue = false
				this.addTiledImage()
			}
		}
	}
}
