import { LayerType } from '../../enum'
import { BaseConfig, DocereConfig } from './config'
import { ConfigEntry } from '../entry'
import { Facsimile, Entity } from './functions'

// Config
export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type: LayerType.Facsimile | LayerType.Text
	filterEntities?: (entry: ConfigEntry) => (entity: Entity) => boolean
	filterFacsimiles?: (entry: ConfigEntry) => (facsimile: Facsimile) => boolean
}

export type ID = string
export type Type = string
// export type ActiveEntities = Set<ID>
// Base
interface BaseLayer {
	// activeFacsimileId: ID
	// activeEntities: ActiveEntities
	columnWidth?: string /* Width of the grid column, ie minmax(480px, 1fr) */
	pinnable?: boolean /* Can the layer be pinned, ie made sticky? */
	width?: number /* Width of the layer content */
}

export type StatefulTextLayer =  TextLayer & BaseLayer
export type StatefulFacsimileLayer =  FacsimileLayer & BaseLayer
export type StatefulLayer =  StatefulTextLayer | StatefulFacsimileLayer

// Text Layer
export type ExtractTextLayerElement = (entry: ConfigEntry, config: DocereConfig) => Element

export interface TextLayerConfig extends LayerConfig {
	extract?: ExtractTextLayerElement
	type: LayerType.Text
}


export interface TextLayer extends Omit<SerializedTextLayer, 'facsimiles' | 'entities'>, LayerTextData {
	// element: Element
	// content: string
	type: LayerType.Text
}

	// element: Element

// export interface TextLayerPayload extends Omit<TextLayer, 'element'> {
// 	content: string
// }

// Facsimile Layer
export interface FacsimileLayerConfig extends LayerConfig {
	type: LayerType.Facsimile
}

export interface FacsimileLayer extends Omit<SerializedBaseLayer, 'facsimiles' | 'entities'>, LayerTextData {
	type: LayerType.Facsimile
}

// Layer
export type Layer = TextLayer | FacsimileLayer
export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>
interface SerializedLayerTextData {
	facsimiles: ID[]
	entities: [Type, ID[]][]
}
interface LayerTextData {
	facsimiles: Set<ID>
	entities: Map<Type, Set<ID>>
}

// Serialized layer
export type SerializedBaseLayer =
	Required<BaseConfig> &
	Required<Pick<LayerConfig, 'active' | 'pinned' | 'type'>> &
	SerializedLayerTextData

export type SerializedTextLayer = SerializedBaseLayer & {
	content: string
	type: LayerType.Text
}

export type SerializedFacsimileLayer = SerializedBaseLayer & {
	type: LayerType.Facsimile
}

export type SerializedLayer = SerializedTextLayer | SerializedFacsimileLayer

// Find the first active facsimile in the layer. There can be more active
// facsimiles in other layers.
// export function getFirstActiveFacsimileFromLayer(activeFacsimiles: ActiveFacsimiles, layer: Layer) {
// 	if (activeFacsimiles == null) return null

// 	return Array.from(activeFacsimiles.values())
// 		.find(activeFacsimile =>
// 			layer.facsimiles.find(f =>
// 				f.id === activeFacsimile.id
// 			)
// 		)
// }
// export type ClientTextLayer = ClientBaseLayer & {
// 	content: string
// }
