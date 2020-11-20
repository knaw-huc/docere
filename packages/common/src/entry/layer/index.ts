import { LayerType } from '../../enum'
import { BaseConfig, DocereConfig } from '../../types/config-data/config'
import type { ExtractedEntry, ExtractedFacsimile, ExtractedEntity } from '..'

export * from './serialize'

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

export type ExtractTextLayerElement = (entry: ExtractedEntry, config: DocereConfig) => Element
export interface TextLayerConfig extends LayerConfig {
	extractElement?: ExtractTextLayerElement
	type: LayerType.Text
}

export interface ExtractedTextLayer extends TextLayerConfig {
	el: Element
	facsimiles: ExtractedFacsimile[]
	entities: ExtractedEntity[]
}

export interface ExtractedFacsimileLayer extends FacsimileLayerConfig {
	facsimiles: ExtractedFacsimile[]
	entities: ExtractedEntity[]
}

export type ExtractedLayer = ExtractedTextLayer | ExtractedFacsimileLayer

/**
 * Serialized layer
 * 
 * This is a stringified version of the layer. It is used to transfer the layer
 * between the API server and Puppeteer and for storing in Postgres.
 */ 
interface SerializedLayerTextData {
	facsimiles: ID[]
	entities: [Type, ID[]][]
}
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

// Layer
export interface TextLayer extends Omit<SerializedTextLayer, 'facsimiles' | 'entities'>, LayerTextData {
	type: LayerType.Text
}

export interface FacsimileLayer extends Omit<SerializedBaseLayer, 'facsimiles' | 'entities'>, LayerTextData {
	type: LayerType.Facsimile
}

interface LayerTextData {
	facsimiles: Set<ID>
	entities: Map<Type, Set<ID>>
}
export type Layer = TextLayer | FacsimileLayer
// export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>

/**
 * Stateful layer
 * 
 * This is the layer that is used in the front-end. It is called stateful
 * because this type of layer has data on how it is presented. Some of the 
 * stateful props are already present in the {@link LayerConfig}.
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
