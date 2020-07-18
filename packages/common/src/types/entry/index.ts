import type { Entity, Note, Facsimile, ExtractedMetadata } from '../config-data/functions'
import { BooleanFacetConfig, ListFacetConfig, HierarchyFacetConfig, RangeFacetConfig, DateFacetConfig } from '../search'
import { Layer, ExtractedLayer } from '../config-data/layer'

export * from './state'

export type ListMetadata = ListFacetConfig & { value: string | string[] }
export type HierarchyMetadata = HierarchyFacetConfig & { value: string[] }
export type BooleanMetadata = BooleanFacetConfig & { value: boolean } 
export type RangeMetadata = RangeFacetConfig & { value: number | number[] } 
export type DateMetadata = DateFacetConfig & { value: number | number[] } 
export type MetadataItem = ListMetadata | HierarchyMetadata | BooleanMetadata | RangeMetadata | DateMetadata

export interface Entry {
	doc: XMLDocument
	facsimiles: Facsimile[]
	id: string
	metadata: MetadataItem[]
	notes: Note[]
	entities: Entity[]
	layers: Layer[]
}

export type ExtractedEntry = Omit<Entry, 'doc' | 'layers' | 'metadata'> & {
	layers: ExtractedLayer[]
	metadata: ExtractedMetadata
	text: string
}

						