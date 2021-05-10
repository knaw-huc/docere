// import { ExtractedCommon } from '.'
import { TriggerContainer } from './entity'

export function isFacsimileAreaRectangle(area: FacsimileArea): area is FacsimileAreaRectangle {
	return area.hasOwnProperty('x')
}

export function isFacsimileAreaPolygon(area: FacsimileArea): area is FacsimileAreaPolygon {
	return area.hasOwnProperty('points')
}

interface FacsimileAreaCommon {
	facsimileId: string
	id?: string
}

interface FacsimileAreaPolygon extends FacsimileAreaCommon {
	points: [number, number][]
}

interface FacsimileAreaRectangle extends FacsimileAreaCommon {
	h: number
	unit?: 'px' | 'perc'
	w: number
	x: number
	y: number
}

export type FacsimileArea = FacsimileAreaRectangle | FacsimileAreaPolygon

// export interface FacsimileArea {
// 	facsimileId: string
// 	h: number
// 	id?: string
// 	unit?: 'px' | 'perc'
// 	w: number
// 	x: number
// 	y: number
// }

// export enum FacsimileType {
// 	IIIF = 'IIIF',
// 	Image = 'image',
// }

// interface FacsimileVersion {
// 	path: string
// 	thumbnailPath?: string
// 	type?: FacsimileType
// }
export interface Facsimile {
	id: string
	path: string
	// versions: FacsimileVersion[]
}

export type ExtractedFacsimile = Facsimile //& ExtractedCommon

export type ActiveFacsimile = Facsimile & TriggerContainer
