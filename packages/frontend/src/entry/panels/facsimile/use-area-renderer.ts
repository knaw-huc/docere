import * as React from 'react'
// import { Colors } from '@docere/common'
import type { FacsimileArea } from '@docere/common'

interface Overlay {
	active: boolean
	area: FacsimileArea
	element: HTMLDivElement
	location: any
}

export class AreaRenderer {
	private trackers: OpenSeadragon.MouseTracker[] = []
	private aspectRatio: number
	private imgWidth: number
	private imgHeight: number
	private overlays: Overlay[] = []
	// private lastClick: string

	constructor(
		private osd: any,
		private OpenSeadragon: any,
		private handleAreaClick: (ev: any) => void
	) {}

	private deactivate() {
		this.overlays
			.filter(o => o.active)
			.map(o => { o.active = false; return o; })
			.forEach(o => {
				// if (o.area.showOnHover) o.element.classList.remove('active')
				// else this.osd.removeOverlay(o.element)
				this.osd.removeOverlay(o.element)
			})
	}

	activate(areas: FacsimileArea[]) {
		// Deactivate currently active areas
		this.deactivate()

		// If areas does not exist or is empty, there is nothing to activate
		if (!Array.isArray(areas) || !areas.length) return

		// Activate areas
		// const ids = areas.map(a => a.id)
		this.overlays
			// .filter(o => ids.indexOf(o.area.id) > -1)
			.map(o => { o.active = true; return o; })
			.forEach(o => {
				o.element.classList.add('active')
				// if (!o.area.showOnHover) {
					this.osd.addOverlay({
						checkResize: false,
						element: o.element,
						location: o.location,
					})
				// }
			})

		// Detect if the currect active areas are triggered from the facsimile,
		// if so, no panning is needed. If the active area is triggered from the
		// text or a note, the viewer pans to the active area
		// if (!areas.some(area => area.id === this.lastClick)) this.panTo(areas[0])

		// this.lastClick = null
	}

	render(areas: FacsimileArea[]) {
		this.osd.clearOverlays()
		this.trackers = this.trackers.map(t => t.destroy()).filter(() => false) as []
		this.updateBounds()
		if (areas == null) return

		this.overlays = areas.map(area => ({
			active: false,
			area,
			...this.createOverlay(area),
		}))


		this.overlays
			// .filter(overlay => overlay.area.showOnHover)
			.forEach(overlay => {
				this.osd.addOverlay({
					checkResize: false,
					element: overlay.element,
					location: overlay.location,
				})
			})
	}

	private updateBounds() {
		const { width: imgWidthRatio, height: imgHeightRatio } = this.osd.world.getHomeBounds()
		this.aspectRatio = imgHeightRatio / imgWidthRatio
		this.imgWidth = this.osd.world._contentSize.x
		this.imgHeight = this.osd.world._contentSize.y
	}

	// private handleAreaClick = (ev: any) => {
	// 	const { area } = ev.userData
	// 	// this.lastClick = area.id
	// 	// area.target != null ?
	// 	this.entryDispatch({
	// 		type: 'SET_ENTITY',
	// 		id: area.target.id,
	// 		triggerLayerId: 
	// 	}) //:
	// 	// this.entryDispatch({ type: 'SET_ACTIVE_FACSIMILE_AREAS', ids: [area.id] })
	// }

	private createOverlay(area: FacsimileArea) {
		let { x, y, w, h, unit } = area
		if (unit === 'px') {
			x = x / this.imgWidth
			y = y / this.imgHeight
			w = w / this.imgWidth
			h = h / this.imgHeight
		} 

		const element = document.createElement("div")
		element.classList.add('facsimile-area')

		// element.dataset.id = area.id
		// element.style.borderColor = area.target?.color != null ? area.target.color : Colors.Red

		// if (area.hasOwnProperty('note')) {
		// 	const note = document.createElement('div')
		// 	note.classList.add('facsimile-area-note')
		// 	note.style.borderColor = area.target?.color != null ? area.target.color : Colors.Red
		// 	note.style.backgroundColor = area.target?.color != null ? `${area.target.color}77` : `${Colors.Red}77`
		// 	note.textContent = area.note.hasOwnProperty('suggestion') ?
		// 		`${area.note.ocr} (${area.note.suggestion})` :
		// 		area.note.ocr
		// 	element.appendChild(note)
		// }

		element.classList.add('show')
		const track = new this.OpenSeadragon.MouseTracker({
			element,
			clickHandler: this.handleAreaClick,
			userData: { area }
		})
		this.trackers.push(track)

		y = y * this.aspectRatio
		h = h * this.aspectRatio

		return {
			element,
			location: new this.OpenSeadragon.Rect(x, y, w, h),
		}
	}

	// private panTo(area: FacsimileArea) {
	// 	let { x, y, w, h, unit } = area

	// 	if (unit === 'px') {
	// 		x = x / this.imgWidth
	// 		y = y / this.imgHeight
	// 		w = w / this.imgWidth
	// 		h = h / this.imgHeight
	// 	}

	// 	const point = new this.OpenSeadragon.Point(x + w/2, y + h/2)
	// 	this.osd.viewport.panTo(point)
	// }
}

export default function useAreaRenderer(osd: any, OpenSeadragon: any, handleAreaClick: (ev: any) => void) {
	const [areaRenderer, setAreaRenderer] = React.useState<AreaRenderer>(null)
	React.useEffect(() => {
		if (osd == null) return
		setAreaRenderer(new AreaRenderer(osd, OpenSeadragon, handleAreaClick))
	}, [osd])
	return areaRenderer
}

// function renderFacsimileAreas(osd: any, facsimileAreas: FacsimileArea[], OpenSeadragon: any, dispatch: React.Dispatch<EntryStateAction>) {
// }
