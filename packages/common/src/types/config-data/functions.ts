import type { DocereConfig, EntityConfig } from "./config"
import { AsideTab } from '../../enum'


export interface DocereConfigFunctions {
	extractFacsimiles: (doc: XMLDocument, config: DocereConfig, id: string) => Facsimile[]
	extractMetadata: (doc: XMLDocument, config: DocereConfig, id: string) => ExtractedMetadata
	// extractNotes: (doc: XMLDocument, config: DocereConfig) => Note[]
	extractText: (doc: XMLDocument, config: DocereConfig) => string
	// extractEntities: (doc: XMLDocument, config: DocereConfig) => TextData[]
	// extractLayers: (doc: XMLDocument, config: DocereConfig) => ExtractedLayer[]
	prepareDocument: (doc: XMLDocument, config: DocereConfig, id: string) => XMLDocument
}

export interface ExtractedTextData {
	element?: Element
	id: string
	title?: string
	value?: string
}

// Data extracted from the text: entities, notes, ...
export interface TextData extends ExtractedTextData {
	config: EntityConfig
	count?: number
	// id: string
	// type: string
}


export type Entity = TextData
// EXTRACT ENTITIES
// export interface Entity extends TextData {
// 	element?: Element
// 	value: string
// }

// export interface ActiveEntity extends Entity {
// 	config: EntityConfig
// }

// TODO add default color to default note: DEFAULT_POPUP_BG_COLOR
// EXTRACT NOTES
export interface ExtractedNote extends ExtractedTextData {
	// color?: Colors,
	// el: Element | string
	n?: string
	// targetId: string | number
}

export interface Note extends TextData, ExtractedNote {

}

// EXTRACT METADATA
export type ExtractedMetadata = Record<string, number | number[] | boolean | string | string[]>

// EXTRACT LAYERS

// EXTRACT FACSIMILES

// TODO facsimile area is per entry, but it should be dependant on a facsimile
// TODO an entry has facsimiles with accompanying areas?
export interface FacsimileArea {
	h: number
	id: string
	note?: Record<string, string>
	showOnHover?: boolean
	target?: {
		asideTab?: AsideTab
		color?: string,
		id: string,
		listId?: string,
	}
	unit?: 'px' | 'perc'
	w: number
	x: number
	y: number
}

interface FacsimileVersion {
	areas?: FacsimileArea[]
	path: string
}
export interface Facsimile {
	id: string
	versions: FacsimileVersion[]
}
