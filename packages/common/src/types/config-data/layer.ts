import { LayerType } from '../../enum'
import { BaseConfig, DocereConfig } from './config'
import { Entry } from '../entry'
import { Facsimile, Entity, Note } from './functions'

// Config
export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type?: LayerType.Facsimile | LayerType.Text
	filterEntities?: (entry: Entry) => (entity: Entity) => boolean
	filterFacsimiles?: (entry: Entry) => (facsimile: Facsimile) => boolean
	filterNotes?: (entry: Entry) => (note: Note) => boolean
}

// Base
interface BaseLayer {
	columnWidth?: string /* Width of the grid column, ie minmax(480px, 1fr) */
	pinnable?: boolean /* Can the layer be pinned, ie made sticky? */
	width?: number /* Width of the layer content */
}

// Text Layer
export type ExtractTextLayerElement = (entry: Entry, config: DocereConfig) => Element

export interface TextLayerConfig extends LayerConfig {
	extract?: ExtractTextLayerElement
	type: LayerType.Text
}

type TransferableFromTextLayerConfig = Omit<TextLayerConfig, 'extract' | 'filterEntities' | 'filterFacsimiles' | 'filterNotes'>

export interface TextLayer extends TransferableFromTextLayerConfig, BaseLayer, LayerEntities {
	element: Element
}

export interface TextLayerPayload extends Omit<TextLayer, 'element'> {
	content: string
}

// Facsimile Layer
export interface FacsimileLayerConfig extends LayerConfig {
	type: LayerType.Facsimile
}

export interface FacsimileLayer extends FacsimileLayerConfig, BaseLayer, LayerEntities {
	facsimiles: Facsimile[]
}

// Layer
export type Layer = TextLayer | FacsimileLayer
export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>
interface LayerEntities {
	facsimiles: Facsimile[]
	entities: Entity[]
	notes: Note[]
}
