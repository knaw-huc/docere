import type { Entity, Note, Facsimile, Layer } from '../config-data/functions'
// import type { MetadataConfig } from '../config-data/config'
// import { EsDataType } from '../../enum'
import { BooleanFacetConfig, ListFacetConfig, HierarchyFacetConfig, RangeFacetConfig } from '../search'

export * from './state'

export type ListMetadata = ListFacetConfig & { value: string | string[] }
export type HierarchyMetadata = HierarchyFacetConfig & { value: string[] }
export type BooleanMetadata = BooleanFacetConfig & { value: boolean } 
export type RangeMetadata = RangeFacetConfig & { value: number } 
export type MetadataItem = ListMetadata | HierarchyMetadata | BooleanMetadata | RangeMetadata

export interface Entry {
	doc: XMLDocument
	facsimiles: Facsimile[]
	id: string
	metadata: MetadataItem[]
	notes: Note[]
	entities: Entity[]
	layers: Layer[]
}

						