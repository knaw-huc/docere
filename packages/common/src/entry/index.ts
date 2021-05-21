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

export * from './create-json'
export * from './facsimile'
export * from './layer'
export * from './metadata'
export * from './entity'
export * from './fetch'

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
}

export interface Entry extends JsonEntry {
	textData: {
		facsimiles: Map<ID, Facsimile>
		entities: Map<ID, Entity>
	}
}
