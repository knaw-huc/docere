import * as React from 'react'
import type { Entry, ActiveFacsimile, ID, ActiveEntities } from '@docere/common'

export class AreaRenderer {
	private overlay: any
	private rectTpl: SVGElement
	private cache: Map<ID, DocumentFragment> = new Map()

	constructor(
		private osd: any,
		private OpenSeadragon: any,
		//@ts-ignore
		private handleAreaClick: (ev: any) => void
	) {
		this.overlay = this.osd.svgOverlay()

		this.rectTpl = document.createElementNS('http://www.w3.org/2000/svg','rect')
		this.rectTpl.setAttribute('fill', 'none')
		this.rectTpl.style.opacity = '0'
	}

	/**
	 * Remove all <rect>s from the overlay element. Uses `removeChild`
	 * to ensure event listeners are removed too.
	 */
	clear() {
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
		// Deactivate all active <rect>s
		for (const rect of this.overlay.node().querySelectorAll('.active')) {
			rect.classList.remove('active')
			rect.style.opacity = '0'
		}

		// Keep track of the combined bounds. Is used to zoom and pan
		// to the activated <rect>s
		let combinedBounds: any

		// Activate all active <rect>s
		for (const id of activeEntities.keys()) {
			const rect = this.overlay.node().querySelector(`#e${id}`)
			if (rect == null) return
			rect.classList.add('active')
			rect.style.opacity = '1'

			// Update combined bounds
			const currentBounds = this.getRectBounds(rect.attributes)
			if (combinedBounds != null) combinedBounds = combinedBounds.union(currentBounds)
			else combinedBounds = currentBounds
		}
		
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
	private getRectBounds(attributes: NamedNodeMap) {
		const x = parseFloat(attributes.getNamedItem('x').value)
		const y = parseFloat(attributes.getNamedItem('y').value)
		const w = parseFloat(attributes.getNamedItem('width').value)
		const h = parseFloat(attributes.getNamedItem('height').value)
		return new this.OpenSeadragon.Rect(x, y, w, h)
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
		const { x: relativeWidth } = this.osd.viewport.imageToViewportCoordinates(3, 0)
		const strokeWidth = (relativeWidth - .5) * 5 
		this.rectTpl.setAttribute('stroke-width', strokeWidth.toString())

		// Create the <rect>s, but skip if the <rect>s are already in the cache
		if (!this.cache.has(facsimile.id)) {
			const fragment = document.createDocumentFragment()
			for (const entity of entry.textData.entities.values()) {
				if (entity.facsimileAreas == null) continue

				// Set color to be half transparent, only the last entity
				// (could be multiple areas) is set to fully opague
				this.rectTpl.setAttribute('stroke', `${entity.color}88`)

				entity.facsimileAreas.forEach(area => {
					const vpRect = this.osd.viewport.imageToViewportRectangle(area.x, area.y, area.w, area.h)
					const rect = this.rectTpl.cloneNode() as Element
					rect.setAttribute('x', (vpRect.x - strokeWidth/2).toString())
					rect.setAttribute('y', (vpRect.y - strokeWidth/2).toString())
					rect.setAttribute('width', vpRect.width + strokeWidth)
					rect.setAttribute('height', vpRect.height + strokeWidth)
					rect.id = `e${entity.id}`
					fragment.appendChild(rect)
				})
			}

			// Add the created fragment to the cache
			this.cache.set(facsimile.id, fragment)
		}

		// Add the <rect>s to the overlay element
		this.overlay.node().appendChild(this.cache.get(facsimile.id).cloneNode(true) as DocumentFragment)
	}
}

export default function useAreaRenderer(osd: any, OpenSeadragon: any, handleAreaClick: (ev: any) => void) {
	const [areaRenderer, setAreaRenderer] = React.useState<AreaRenderer>(null)
	React.useEffect(() => {
		if (osd == null) return
		setAreaRenderer(new AreaRenderer(osd, OpenSeadragon, handleAreaClick))
	}, [osd])
	return areaRenderer
}
