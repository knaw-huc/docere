import { BooleanFacetConfig, ListFacetConfig, HierarchyFacetConfig, RangeFacetConfig, DateFacetConfig } from '../types/search'
import { Layer, ID, ExtractedLayer } from './layer'
import { Entity, ExtractedEntity } from './entity'
import { ExtractedFacsimile, Facsimile } from './facsimile'

// export * from './deserialize'
export * from './entity'
export * from './extract'
export * from './facsimile'
export * from './layer'
export * from './metadata'
// export * from './serialize'
export * from './use-entry'

// TODO move
export type ListMetadata = ListFacetConfig & { value: string | string[] }
export type HierarchyMetadata = HierarchyFacetConfig & { value: string[] }
export type BooleanMetadata = BooleanFacetConfig & { value: boolean } 
export type RangeMetadata = RangeFacetConfig & { value: number | number[] } 
export type DateMetadata = DateFacetConfig & { value: number | number[] } 
export type MetadataItem = ListMetadata | HierarchyMetadata | BooleanMetadata | RangeMetadata | DateMetadata

// Extracted entry
export type ExtractedEntry = Omit<Entry, 'layers' | 'textData' | 'selector'> & {
	document: XMLDocument
	entities: ExtractedEntity[]
	facsimiles: ExtractedFacsimile[]
	layers: ExtractedLayer[]
	parent?: ExtractedEntry
	parts?: EntryParts
	preparedElement: Element
}

export type EntryParts = Map<string, ExtractedEntry>

// Serialized entry
export interface SerializedEntry {
	// content: string
	id: ID
	layers: Layer[]
	metadata: Entry['metadata']
	// parts: SerializedEntry[]
	// plainText: string
	textData: {
		// entities?: [ID, Entity][]
		facsimiles: [ID, ExtractedFacsimile][]
	}
}

// Entry
export interface Entry {
	id: ID
	layers: Layer[]
	metadata: MetadataItem[]
	textData: EntryTextData
}

export interface EntryTextData {
	facsimiles: Map<ID, Facsimile>
	entities: Map<ID, Entity>
}
