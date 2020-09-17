import { LayerType } from '../../enum'
import { BaseConfig, DocereConfig } from './config'
import { Entry } from '../entry'
import { Facsimile } from './functions'

// Config
export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type?: LayerType.Facsimile | LayerType.Text
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

export interface TextLayer extends TextLayerConfig, BaseLayer {
	element: Element
}

// Facsimile Layer
export interface FacsimileLayerConfig extends LayerConfig {
	extract: (entry: Entry, config: DocereConfig) => Facsimile[]
	type: LayerType.Facsimile
}

export interface FacsimileLayer extends FacsimileLayerConfig, BaseLayer {
	facsimiles: Facsimile[]
}

// Layer
export type Layer = TextLayer | FacsimileLayer
export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>
