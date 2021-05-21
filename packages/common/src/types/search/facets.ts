import { HierarchyMetadata, MetadataItem } from "../../entry"
import {
	BooleanMetadataConfig,
	DateMetadataConfig,
	HierarchyMetadataConfig,
	ListMetadataConfig,
	RangeMetadataConfig
} from "../../entry/metadata"

import { EsDataType, SortBy, SortDirection } from "../../enum"

export type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValue[]

export type FacetData = ListFacetData | BooleanFacetData | HierarchyFacetData | RangeFacetData | DateFacetData
export type FacetsData = Map<string, FacetData>

/*
 * BaseConfig is defined in @docere/common because it is also the
 * base for metadata and entities config
*/
export interface FacetConfigBase {
	readonly datatype?: EsDataType
	readonly description?: string
	readonly order?: number
}

interface OtherFacetConfig extends FacetConfigBase {
	readonly datatype?: EsDataType.Geo_point | EsDataType.Null | EsDataType.Text
}

export type FacetConfig = BooleanFacetConfig | DateFacetConfig | HierarchyFacetConfig | ListFacetConfig | RangeFacetConfig | OtherFacetConfig

// FACET FILTERS
export type ListFacetFilter = Set<string>

export type FacetFilter = ListFacetFilter | RangeFacetValue[]

// BOOLEAN FACET
export interface BooleanFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Boolean
	readonly labels?: { 'false': string, 'true': string }
}

export interface BooleanFacetData {
	readonly config: BooleanMetadataConfig
	filters: ListFacetFilter
} 

export type BooleanFacetValues = [
	{ key: 'true', count: number},
	{ key: 'false', count: number}
]

// TODO. This is used in @docere/api, but should come from @docere/search
// or move guards from search to common
export function isHierarchyFacetConfig(config: FacetConfigBase): config is HierarchyFacetConfig {
	return config.datatype === EsDataType.Hierarchy
}

// TODO. This is used in @docere/api, but should come from @docere/search
// or move guards from search to common
export function isHierarchyMetadataItem(metadataItem: MetadataItem): metadataItem is HierarchyMetadata {
	return metadataItem.config.facet.datatype === EsDataType.Hierarchy
}

export interface HierarchyFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Hierarchy
	readonly size?: number
	readonly levels: number
}

export interface HierarchyFacetData {
	readonly config: HierarchyMetadataConfig
	filters: ListFacetFilter
	size: number
} 

export interface HierarchyKeyCount {
	child: HierarchyFacetValues
	count: number
	key: string
}

export interface HierarchyFacetValues {
	total: number
	values: HierarchyKeyCount[]
}

// LIST FACET
export interface ListFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Keyword
	size?: number
	sort?: {
		by: SortBy
		direction: SortDirection
	}
}

export interface ListFacetData {
	readonly config: ListMetadataConfig
	filters: ListFacetFilter
	query: string
	size: ListFacetConfig['size']
	sort: ListFacetConfig['sort']
} 

export interface KeyCount {
	key: string,
	count: number
}

export interface ListFacetValues {
	total: number
	values: KeyCount[]
}

// DATE & RANGE FACET
interface DateAndRangeFacetConfig extends FacetConfigBase {
	readonly collapseFilters?: boolean
}

interface DateAndRangeFacetData {
	collapseFilters: boolean
	filters: RangeFacetValue[],
	value: RangeFacetValue
} 

// DATE FACET
export interface DateFacetConfig extends DateAndRangeFacetConfig {
	readonly datatype: EsDataType.Date
	readonly interval: DateInterval
}

export type DateInterval = 'y' | 'q' | 'M' | 'd' | 'h' | 'm'

export interface DateFacetData extends DateAndRangeFacetData {
	readonly config: DateMetadataConfig
	interval: DateInterval
} 

// RANGE FACET
export interface RangeFacetConfig extends DateAndRangeFacetConfig {
	readonly datatype: EsDataType.Integer
	readonly range: number,
}

export interface RangeFacetValue {
	from: number
	to: number
	fromLabel: string
	toLabel: string
	count: number
}

export interface RangeFacetData extends DateAndRangeFacetData {
	readonly config: RangeMetadataConfig
	interval: number
} 
