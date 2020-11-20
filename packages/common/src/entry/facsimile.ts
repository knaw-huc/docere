import { ID, ExtractedCommon } from '.';

export interface FacsimileArea {
	h: number
	facsimileId: string
	unit?: 'px' | 'perc'
	w: number
	x: number
	y: number
}

export enum FacsimileType {
	IIIF = 'IIIF',
	Image = 'image',
}

interface FacsimileVersion {
	path: string
	thumbnailPath?: string
	type?: FacsimileType
}
export interface Facsimile {
	id: string
	versions: FacsimileVersion[]
}

export type ExtractedFacsimile = Facsimile & ExtractedCommon

export interface ActiveFacsimile extends Facsimile {
	layerId: ID
	triggerLayerId: ID
}
