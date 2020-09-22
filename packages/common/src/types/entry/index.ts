import { BooleanFacetConfig, ListFacetConfig, HierarchyFacetConfig, RangeFacetConfig, DateFacetConfig } from '../search'
import { Layer, SerializedLayer } from '../config-data/layer'
import type { Entity, Note, ExtractedMetadata, Facsimile } from '../config-data/functions'
import { DocereConfig } from '../config-data/config'

export * from './state'

export type ListMetadata = ListFacetConfig & { value: string | string[] }
export type HierarchyMetadata = HierarchyFacetConfig & { value: string[] }
export type BooleanMetadata = BooleanFacetConfig & { value: boolean } 
export type RangeMetadata = RangeFacetConfig & { value: number | number[] } 
export type DateMetadata = DateFacetConfig & { value: number | number[] } 
export type MetadataItem = ListMetadata | HierarchyMetadata | BooleanMetadata | RangeMetadata | DateMetadata

export interface Entry {
	id: string
	layers: Layer[]
	metadata: MetadataItem[]
}

export type ConfigEntry = Omit<Entry, 'layers'> & {
	document: XMLDocument
	element: Element
	entities: Entity[]
	facsimiles: Facsimile[]
	layers: SerializedLayer[]
	notes: Note[]
	parts?: EntryParts
}

export type EntryParts = Map<string, ConfigEntry>

export type SerializedEntry = Omit<ConfigEntry, 'document' | 'element' | 'parts' | 'metadata'> & {
	metadata: ExtractedMetadata
	parts: SerializedEntry[]
	plainText: string
	content: string
}

export interface GetEntryProps {
	config: DocereConfig
	document: XMLDocument
	element: Element
	id: string
}

export interface GetPartProps extends GetEntryProps {
	parent: ConfigEntry
}

// export function extractIdsFromElasticSearchId(elasticSearchId: string) {
// 	return elasticSearchId.split('__part__')
// }

// export function createElasticSearchIdFromIds(documentId: string, partId?: string) {
// 	return partId == null ? documentId : `${documentId}__part__${partId}`
// }
