import { LayerType } from '../../enum'
import { BaseConfig, DocereConfig } from './config'

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
type ExtractTextLayer = (doc: XMLDocument, config: DocereConfig) => XMLDocument | Element

export interface TextLayerConfig extends LayerConfig {
	extract?: ExtractTextLayer
	type: LayerType.Text
}

export interface TextLayer extends TextLayerConfig, BaseLayer {
	element: XMLDocument | Element
}

// Facsimile Layer
export interface FacsimileLayerConfig extends LayerConfig {
	type: LayerType.Facsimile
}

interface FacsimileLayer extends FacsimileLayerConfig, BaseLayer {
}

// Layer
export type Layer = TextLayer | FacsimileLayer
export type ExtractedLayer = Pick<Layer, 'id'> & Partial<Layer>
