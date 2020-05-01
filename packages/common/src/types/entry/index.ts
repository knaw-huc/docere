import type { Entity, Note, Facsimile, ExtractedMetadata, Layer } from '../config-data/functions'
import type { MetadataConfig } from '../config-data/config'

export * from './state'

export type MetadataItem = MetadataConfig & {
	value: ExtractedMetadata[keyof ExtractedMetadata]
}

export interface Entry {
	doc: XMLDocument
	facsimiles: Facsimile[]
	id: string
	metadata: MetadataItem[]
	notes: Note[]
	entities: Entity[]
	layers: Layer[]
}

						