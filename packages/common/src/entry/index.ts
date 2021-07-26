import { Layer, ID } from './layer'
import { Entity } from './entity'
import { Facsimile } from './facsimile'
import {
	BaseMetadataConfig,
	BooleanMetadataConfig,
	DateMetadataConfig,
	HierarchyMetadataConfig,
	ListMetadataConfig,
	MetadataValue,
	RangeMetadataConfig
} from './metadata'
import { DocereAnnotation } from '../standoff-annotations'

export * from './create-json'
export * from './facsimile'
export * from './from-source'
export * from './layer'
export * from './metadata'
export * from './entity'
export * from './fetch'

export function isEntityAnnotation(annotation: DocereAnnotation): annotation is Entity {
	return annotation.props._entityId != null
}

export function isFacsimileAnnotation(annotation: DocereAnnotation): annotation is Facsimile {
	return annotation.props._facsimileId != null && annotation.props._facsimilePath != null
}


export interface ListMetadata {
	config: ListMetadataConfig,
	value: string | string[]
}

export interface HierarchyMetadata {
	config: HierarchyMetadataConfig,
	value: string[]
}

export interface BooleanMetadata {
	config: BooleanMetadataConfig
	value: boolean
} 

export interface RangeMetadata {
	config: RangeMetadataConfig
	value: number | number[]
} 

export interface DateMetadata {
	config: DateMetadataConfig
	value: number | number[]
} 

// export type MetadataItem =	ListMetadata |
// 							HierarchyMetadata |
// 							BooleanMetadata |
// 							RangeMetadata |
// 							DateMetadata

export interface MetadataItem {
	config: BaseMetadataConfig
	value: MetadataValue
}

export interface JsonEntry {
	id: ID
	layers: Layer[]
	metadata: MetadataItem[]
	partId?: ID
	sourceId: ID
}

export interface Entry extends JsonEntry {
	textData: {
		facsimiles: Map<ID, Facsimile>
		entities: Map<ID, Entity>
	}
}
