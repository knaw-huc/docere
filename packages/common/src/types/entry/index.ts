import { BooleanFacetConfig, ListFacetConfig, HierarchyFacetConfig, RangeFacetConfig, DateFacetConfig } from '../search'
import { SerializedLayer, Layer, ID } from '../config-data/layer'
import type { Entity, Facsimile } from '../config-data/functions'
import { DocereConfig } from '../config-data/config'

export * from './state'
export * from './use-entry'
export * from './layer/serialize'

export type ListMetadata = ListFacetConfig & { value: string | string[] }
export type HierarchyMetadata = HierarchyFacetConfig & { value: string[] }
export type BooleanMetadata = BooleanFacetConfig & { value: boolean } 
export type RangeMetadata = RangeFacetConfig & { value: number | number[] } 
export type DateMetadata = DateFacetConfig & { value: number | number[] } 
export type MetadataItem = ListMetadata | HierarchyMetadata | BooleanMetadata | RangeMetadata | DateMetadata

export interface EntryTextData {
	facsimiles: Map<ID, Facsimile>
	entities: Map<ID, Entity>
}

export interface Entry {
	id: ID
	layers: Layer[]
	metadata: MetadataItem[]
	textData: EntryTextData
}

export type ConfigEntry = Omit<Entry, 'layers' | 'textData'> & {
	document: XMLDocument
	element: Element
	entities: Entity[]
	facsimiles: Facsimile[]
	layers: SerializedLayer[]
	parent?: ConfigEntry
	parts?: EntryParts
}

export type EntryParts = Map<string, ConfigEntry>

export interface SerializedEntry extends Pick<ConfigEntry, 'layers' | 'id' | 'metadata'> {
	content: string
	parts: SerializedEntry[]
	plainText: string
	textData: {
		entities: [ID, Entity][]
		facsimiles: [ID, Facsimile][]
	}
}

export interface GetEntryProps {
	config: DocereConfig
	document: XMLDocument
	element: Element
	id: ID
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
