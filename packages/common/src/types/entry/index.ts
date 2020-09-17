import { BooleanFacetConfig, ListFacetConfig, HierarchyFacetConfig, RangeFacetConfig, DateFacetConfig } from '../search'
import { Layer, ExtractedLayer } from '../config-data/layer'
import type { Entity, Note, ExtractedMetadata } from '../config-data/functions'
import { DocereConfig } from '../config-data/config'

export * from './state'

export type ListMetadata = ListFacetConfig & { value: string | string[] }
export type HierarchyMetadata = HierarchyFacetConfig & { value: string[] }
export type BooleanMetadata = BooleanFacetConfig & { value: boolean } 
export type RangeMetadata = RangeFacetConfig & { value: number | number[] } 
export type DateMetadata = DateFacetConfig & { value: number | number[] } 
export type MetadataItem = ListMetadata | HierarchyMetadata | BooleanMetadata | RangeMetadata | DateMetadata

export interface Entry {
	document: XMLDocument
	element: Element
	entities: Entity[]
	// facsimiles: Facsimile[]
	id: string
	layers: Layer[]
	metadata: MetadataItem[]
	notes: Note[]
	parts?: EntryParts
}

export type EntryParts = Map<string, Entry>

export type ExtractedEntry = Omit<Entry, 'document' | 'element' | 'layers' | 'metadata' | 'parts'> & {
	layers: ExtractedLayer[]
	metadata: ExtractedMetadata
	parts: ExtractedEntry[]
	text: string
}

export interface GetEntryProps {
	config: DocereConfig
	document: XMLDocument
	element: Element
	id: string
}

export interface GetPartProps extends GetEntryProps {
	parent: Entry
}

export function extractIdsFromElasticSearchId(elasticSearchId: string) {
	return elasticSearchId.split('__part__')
}

export function createElasticSearchIdFromIds(documentId: string, partId?: string) {
	return partId == null ? documentId : `${documentId}__part__${partId}`
}
