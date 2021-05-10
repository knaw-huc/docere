import React from 'react'
import { Entry, ActiveFacsimile, ID, ActiveEntities, ProjectAction, isFacsimileAreaRectangle, isFacsimileAreaPolygon } from '@docere/common'
import { FacsimileArea } from '@docere/common'
import OpenSeadragon from 'openseadragon'

type AreaCache = {
	entryId: string,
	entityId: string,
	points: OpenSeadragon.Point[]
}[]

export class AreaRenderer {
	// private activeFacsimile: ActiveFacsimile
	private overlay: any
	private rectTpl: SVGElement
	private cache: Map<ID, {
		fragment: DocumentFragment,
		areas: AreaCache
	}> = new Map()
	private strokeWidth: number

	private areas: AreaCache = []

	constructor(
		private osd: OpenSeadragon.Viewer,
		private OpenSeadragon: any,
		// @ts-ignore
		private dispatch: React.Dispatch<ProjectAction>
	) {
		// @ts-ignore
		this.overlay = this.osd.svgOverlay()
		this.rectTpl = document.createElementNS('http://www.w3.org/2000/svg','rect')
		this.rectTpl.setAttribute('fill', 'none')
		this.rectTpl.style.opacity = '0'

		this.osd.addHandler('canvas-click', this.canvasClickHandler)
	}

	private canvasClickHandler = (event: OpenSeadragon.ViewerEvent) => {
		// TODO what does quick do/tell?
		if (!event.quick) return

		const point = this.osd.viewport.pointFromPixel(event.position)

		const areas = this.areas.filter(area => {
			return this.insidePoly(area.points, point.x, point.y)
		})

		areas.forEach(area => {
			this.dispatch({
				type: 'ADD_ENTITY',
				entityId: area.entityId
			})
		})
	}

	private insidePoly(poly: OpenSeadragon.Point[], pointx: number, pointy: number) {
		var i, j;
		var inside = false;
		for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
			if (
				((poly[i].y > pointy) != (poly[j].y > pointy)) &&
				(pointx < (poly[j].x-poly[i].x) * (pointy-poly[i].y) / (poly[j].y-poly[i].y) + poly[i].x)
			)
			inside = !inside;
		}
		return inside;
	}

	/**
	 * Remove all <rect>s from the overlay element. Uses `removeChild`
	 * to ensure event listeners are removed too.
	 */
	clear() {
		this.areas = []

		while (this.overlay.node().firstChild) {
			this.overlay.node().removeChild(this.overlay.node().firstChild);
		}
	}

	/**
	 * Active <rect>s based on the active entities 
	 * 
	 * @param activeEntities 
	 */
	activate(activeEntities: ActiveEntities) {
		// console.log(activeEntities.values().next().value?.facsimileAreas)
		// Deactivate all active <rect>s
		for (const rect of this.overlay.node().querySelectorAll('.active')) {
			rect.classList.remove('active')
			rect.style.opacity = '0'
		}

		this.osd.clearOverlays()

		// Keep track of the combined bounds. Is used to zoom and pan
		// to the activated <rect>s
		let combinedBounds: any

		// Activate all active <rect>s
		let index = -1
		activeEntities.forEach((entity) => {
			console.log(entity)
			index += 1
			let rect: SVGRectElement
			let currentBounds: any

			const lastEntity = activeEntities.size === index + 1

			entity.props._areas?.forEach(fa => {
				rect = this.overlay.node().querySelector(`#${fa.id}`)
				if (rect == null) return
				rect.classList.add('active')
				rect.style.opacity = '1'

				// Set color to be half transparent, only the last entity
				// (could be multiple areas) is set to fully opague
				rect.setAttribute(
					'fill',
					lastEntity ? `${entity.props._config.color}66` : `${entity.props._config.color}66`
				)

				// Update combined bounds
				currentBounds = this.getRectBounds(fa)
				if (combinedBounds != null) combinedBounds = combinedBounds.union(currentBounds)
				else combinedBounds = currentBounds
			})

			if (lastEntity) {
				if (currentBounds == null) return
				const element = document.querySelector(`[data-id="entity_${entity.props._entityId}"]`).cloneNode(true)

				if (element != null) {
					this.osd.addOverlay({
						checkResize: false,
						element,
						x: currentBounds.x + currentBounds.width / 2, //- (this.strokeWidth / 2),
						y: currentBounds.y + currentBounds.height - (this.strokeWidth / 2),
						placement: "TOP"
					})
				}
			}
		})
		
		if (combinedBounds) {
			const extraSpace = combinedBounds.width / 10;
			this.osd.viewport.fitBounds(new this.OpenSeadragon.Rect(
				combinedBounds.x - extraSpace,
				combinedBounds.y - extraSpace,
				combinedBounds.width + extraSpace * 2,
				combinedBounds.height + extraSpace * 2
			))
		}


	}

	/**
	 * Extract the bounds from a <rect>
	 * 
	 * @param attributes
	 */
	private getRectBounds(area: FacsimileArea) {
		if (isFacsimileAreaRectangle(area)) {
			return this.osd.viewport.imageToViewportRectangle(area.x, area.y, area.w, area.h)
		} else if (isFacsimileAreaPolygon(area)) {
			const xs = area.points.map(p => p[0])
			const ys = area.points.map(p => p[1])

			const x = Math.min(...xs)
			const y = Math.min(...ys)
			const maxX = Math.max(...xs)
			const maxY = Math.max(...ys)
			const w = maxX - x
			const h = maxY - y

			return this.osd.viewport.imageToViewportRectangle(x, y, w, h)
		}
		// const x = parseFloat(attributes.getNamedItem('x').value)
		// const y = parseFloat(attributes.getNamedItem('y').value)
		// const w = parseFloat(attributes.getNamedItem('width').value)
		// const h = parseFloat(attributes.getNamedItem('height').value)
	}

	/**
	 * Render all facsimile areas (<rect>s) when the entry changes.
	 * To activate an area, it only has to be made visible. With SVG
	 * this is faster than creating and destroying elements. Tried it 
	 * first with HTML elements, but they all need an overlay and
	 * OpenSeadragon updates every overlay on zoom which is bad for
	 * performance. With an SVG overlay only the parent <g> is updated.
	 * 
	 * @param entry 
	 * @param facsimile 
	 */
	render(entry: Entry, facsimile: ActiveFacsimile) {
		this.clear()

		// Get the width of the <rect> stroke in pixels and set in
		// viewport size. Setting the stroke value as "3px" does not
		// work because of the scale() CSS on the parent <g>.
		this.setStrokeWidth()
		this.rectTpl.setAttribute('stroke-width', this.strokeWidth.toString())

		// Create the <rect>s, but skip if the <rect>s are already in the cache
		if (!this.cache.has(facsimile.id)) {
			const fragment = document.createDocumentFragment()
			const areas: AreaCache = []

			for (const entity of entry.textData.entities.values()) {
				if (entity.props._areas == null) continue

				entity.props._areas.forEach(area => {
					if (area.facsimileId !== facsimile.id) return

					if (isFacsimileAreaRectangle(area)) {
						const vpRect = this.osd.viewport.imageToViewportRectangle(area.x, area.y, area.w, area.h)
						const rect = this.rectTpl.cloneNode() as Element
						rect.setAttribute('x', (vpRect.x - this.strokeWidth/2).toString())
						rect.setAttribute('y', (vpRect.y - this.strokeWidth/2).toString())
						rect.setAttribute('width', (vpRect.width + this.strokeWidth).toString())
						rect.setAttribute('height', (vpRect.height + this.strokeWidth).toString())
						rect.id = area.id
						fragment.appendChild(rect)
					} else if (isFacsimileAreaPolygon(area)) {
						const polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon')
						const points = area.points
							.map(([x, y]) => {
								return this.osd.viewport.imageToViewportCoordinates(x, y)
							})
						polygon.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '))
								
						polygon.style.opacity = '0'
						polygon.id = area.id
						fragment.appendChild(polygon)

						areas.push({
							entryId: entry.id,
							entityId: entity.props._entityId,
							points,
						})
					}
				})
			}

			// Add the created fragment to the cache
			this.cache.set(facsimile.id, { fragment, areas })
		}

		// Add the <rect>s to the overlay element
		const { fragment, areas } = this.cache.get(facsimile.id)
		this.areas = areas
		this.overlay.node().appendChild(fragment.cloneNode(true) as DocumentFragment)
	}

	private setStrokeWidth() {
		const { x: relativeWidth } = this.osd.viewport.imageToViewportCoordinates(3, 0)
		this.strokeWidth = (relativeWidth - .5) * 5 
	}
}


export default function useAreaRenderer(osd: any, OpenSeadragon: any, dispatch: React.Dispatch<ProjectAction>) {
	const [areaRenderer, setAreaRenderer] = React.useState<AreaRenderer>(null)
	React.useEffect(() => {
		if (osd == null || OpenSeadragon == null) return
		setAreaRenderer(new AreaRenderer(osd, OpenSeadragon, dispatch))
	}, [osd, OpenSeadragon])
	return areaRenderer
}
