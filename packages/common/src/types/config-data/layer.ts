import { LayerType } from '../../enum'
import { BaseConfig, DocereConfig } from './config'
import { ConfigEntry } from '../entry'
import { Facsimile, Entity, Note } from './functions'

// Config
export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type?: LayerType.Facsimile | LayerType.Text
	filterEntities?: (entry: ConfigEntry) => (entity: Entity) => boolean
	filterFacsimiles?: (entry: ConfigEntry) => (facsimile: Facsimile) => boolean
	filterNotes?: (entry: ConfigEntry) => (note: Note) => boolean
}

// Base
interface BaseLayer {
	columnWidth?: string /* Width of the grid column, ie minmax(480px, 1fr) */
	pinnable?: boolean /* Can the layer be pinned, ie made sticky? */
	width?: number /* Width of the layer content */
}

// Text Layer
export type ExtractTextLayerElement = (entry: ConfigEntry, config: DocereConfig) => Element

export interface TextLayerConfig extends LayerConfig {
	extract?: ExtractTextLayerElement
	type: LayerType.Text
}


export interface TextLayer extends SerializedTextLayer, BaseLayer {
	// element: Element
	content: string
}

	// element: Element

// export interface TextLayerPayload extends Omit<TextLayer, 'element'> {
// 	content: string
// }

// Facsimile Layer
export interface FacsimileLayerConfig extends LayerConfig {
	type: LayerType.Facsimile
}

export interface FacsimileLayer extends SerializedFacsimileLayer, BaseLayer {
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

// Serialized layer
export type SerializedBaseLayer =
	Required<BaseConfig> &
	Required<Pick<LayerConfig, 'active' | 'pinned' | 'type'>> &
	LayerEntities

export type SerializedTextLayer = SerializedBaseLayer & {
	content: string
}

export type SerializedFacsimileLayer = SerializedBaseLayer

export type SerializedLayer = SerializedTextLayer | SerializedFacsimileLayer

// export type ClientTextLayer = ClientBaseLayer & {
// 	content: string
// }
