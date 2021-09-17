import { LayerType } from '../../enum'
import { FilterFunction, PartialStandoff, StandoffTree3 } from '../../standoff-annotations'
import { BaseConfig } from '../metadata'

// export * from './serialize'

// TODO move to index.ts or something
export type ID = string
export type Type = string

// Layer config
export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type: LayerType.Facsimile | LayerType.Text
}

export interface FacsimileLayerConfig extends LayerConfig {
	type: LayerType.Facsimile
}

// export type ExtractTextLayerElement = (entry: ExtractedEntry, config: DocereConfig) => Element
export interface TextLayerConfig extends LayerConfig {
	// extractElement?: ExtractTextLayerElement
	type: LayerType.Text
	findRoot?: FilterFunction
}

// export interface ExtractedTextLayer extends TextLayerConfig {
// 	el: Element
// 	facsimiles: ExtractedFacsimile[]
// 	entities: ExtractedEntity[]
// }

// export interface ExtractedFacsimileLayer extends FacsimileLayerConfig {
// 	facsimiles: ExtractedFacsimile[]
// 	entities: ExtractedEntity[]
// }

// export type ExtractedLayer = ExtractedTextLayer | ExtractedFacsimileLayer

/**
 * Serialized layer
 * 
 * This is a stringified version of the layer. It is used to transfer the layer
 * between the API server and Puppeteer and for storing in Postgres.
 */ 
// interface SerializedLayerTextData {
	// facsimileIds: ID[]
	// entities: [Type, ID[]][]
	// entityIds: ID[]
// }
export type SerializedBaseLayer =
	Required<BaseConfig> &
	Required<Pick<LayerConfig, 'active' | 'pinned' | 'type'>> //&
	// SerializedLayerTextData

// export type SerializedTextLayer = SerializedBaseLayer & {
// 	type: LayerType.Text
// }

// export type SerializedFacsimileLayer = SerializedBaseLayer & {
// 	type: LayerType.Facsimile
// }

// export type SerializedLayer = SerializedTextLayer | SerializedFacsimileLayer

// Layer
export interface TextLayer extends SerializedBaseLayer {//extends Omit<SerializedTextLayer, 'facsimileIds' | 'entityIds'>, LayerTextData {
	partialStandoff: PartialStandoff
	// tree: DocereAnnotation
	type: LayerType.Text
	standoffTree3: StandoffTree3
}

export interface FacsimileLayer extends SerializedBaseLayer {//extends Omit<SerializedBaseLayer, 'facsimileIds' | 'entityIds'>, LayerTextData {
	type: LayerType.Facsimile
}

// interface LayerTextData {
// 	entityIds: Set<ID> //Map<Type, Set<ID>>
// 	facsimileIds: Set<ID>
// }
export type Layer = TextLayer | FacsimileLayer
// export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>

/**
 * Stateful layer
 * 
 * This is the layer that is used in the front-end. It is called stateful
 * because this type of layer has data on how it is presented. Some of the 
 * stateful props are already present in the {@link LayerConfig}.
 * 
 * TODO make a difference between a layer and a panel, the props of StatefulBaseLayer are all resposibilities of a panel, not a (text)layer
 */
interface StatefulBaseLayer {
	/*
	 * Width of the grid column, ie minmax(480px, 1fr)
	 */
	columnWidth?: string 

	/**
	 * Can the layer be pinned, ie made sticky? Requires a minimum of 2 layers
	 */
	pinnable?: boolean 
	
	/**
	 * Width of the layer content
	 */
	width?: number 
}

export type StatefulTextLayer =  TextLayer & StatefulBaseLayer
export type StatefulFacsimileLayer =  FacsimileLayer & StatefulBaseLayer
export type StatefulLayer =  StatefulTextLayer | StatefulFacsimileLayer

export type Layers = Map<ID, StatefulLayer>
