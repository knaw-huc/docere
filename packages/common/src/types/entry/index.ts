import type { Entity, Note, Facsimile, Metadata, Layer } from '../config-data/functions'

export * from './state'

export interface Entry {
	doc: XMLDocument
	facsimiles: Facsimile[]
	id: string
	metadata: Metadata
	notes: Note[]
	entities: Entity[]
	layers: Layer[]
}

						