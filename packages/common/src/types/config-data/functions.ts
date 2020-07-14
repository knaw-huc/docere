import type { DocereConfig, LayerConfig, TextLayerConfig, EntityConfig } from "./config"
import { LayerType, AsideTab, Colors } from '../../enum'


export interface DocereConfigFunctions {
	extractFacsimiles: (doc: XMLDocument, config: DocereConfig, id: string) => Facsimile[]
	extractMetadata: (doc: XMLDocument, config: DocereConfig, id: string) => ExtractedMetadata
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

export interface ActiveEntity extends Entity {
	config: EntityConfig
}

// TODO add default color to default note: DEFAULT_POPUP_BG_COLOR
// EXTRACT NOTES
export interface Note extends TextData {
	color?: Colors,
	el: Element | string
	n: string
	targetId: string | number
	title?: string
}

// EXTRACT METADATA
export type ExtractedMetadata = Record<string, number | number[] | boolean | string | string[]>

// EXTRACT LAYERS
interface BaseLayer extends LayerConfig {
	columnWidth?: string /* Width of the grid column, ie minmax(480px, 1fr) */
	pinnable?: boolean /* Can the layer be pinned, ie made sticky? */
	width?: number /* Width of the layer content */
}

export interface TextLayer extends TextLayerConfig, BaseLayer {
	type: LayerType.Text
	element: Element | XMLDocument
}

export interface XmlLayer extends BaseLayer {
	element: Element | XMLDocument
	type: LayerType.XML
}

export type Layer = TextLayer | XmlLayer | BaseLayer
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
