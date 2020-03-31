import type { DocereConfig, LayerConfig } from "./config"
import { LayerType, AsideTab } from '../../enum'


export interface DocereConfigFunctions {
	extractFacsimiles: (doc: XMLDocument, config: DocereConfig, id: string) => Facsimile[]
	extractMetadata: (doc: XMLDocument, config: DocereConfig, id: string) => Metadata
	extractNotes: (doc: XMLDocument, config: DocereConfig) => Note[]
	extractText: (doc: XMLDocument, config: DocereConfig) => string
	extractEntities: (doc: XMLDocument, config: DocereConfig) => Entity[]
	extractLayers: (doc: XMLDocument, config: DocereConfig) => ExtractedLayer[]
	prepareDocument: (doc: XMLDocument, config: DocereConfig, id: string) => XMLDocument
}

// Data extracted from the text: entities, notes, ...
export interface TextData {
	count?: number
	id: string
	type: string
}

// EXTRACT ENTITIES
export interface Entity extends TextData {
	element?: Element
	value: string
}

// EXTRACT NOTES
export interface Note extends TextData {
	el: Element
	targetId: string | number
}

// EXTRACT METADATA
export type Metadata = Record<string, number | boolean | string | string[]>

// EXTRACT LAYERS
export interface TextLayerConfig extends LayerConfig {
	type: LayerType.Text
}

export interface TextLayer extends TextLayerConfig {
	element: Element | XMLDocument
}

export interface XmlLayer extends LayerConfig {
	element: Element | XMLDocument
	type: LayerType.XML
}

export type Layer = TextLayer | XmlLayer | LayerConfig
export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>

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
