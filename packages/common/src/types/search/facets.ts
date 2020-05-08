import { EsDataType, SortBy, SortDirection } from "../../enum"
import { BaseConfig } from '../config-data/config'

export type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValue[]

export type FacetData = ListFacetData | BooleanFacetData | HierarchyFacetData | RangeFacetData | DateFacetData
export type FacetsData = Map<string, FacetData>

/*
 * BaseConfig is defined in @docere/common because it is also the
 * base for metadata and entities config
*/
export interface FacetConfigBase extends BaseConfig {
	readonly datatype?: EsDataType
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
	config: BooleanFacetConfig
	filters: ListFacetFilter
} 

export type BooleanFacetValues = [
	{ key: 'true', count: number},
	{ key: 'false', count: number}
]

// HIERARCHY FACET
export interface HierarchyFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Hierarchy
	readonly size?: number
	readonly levels: number
}

export interface HierarchyFacetData {
	config: HierarchyFacetConfig
	filters: ListFacetFilter
	size: number
} 

export interface HierarchyKeyCount {
	child: HierarchyFacetValues
	count: number
	key: string,
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
		by: SortBy,
		direction: SortDirection,
	}
}

export interface ListFacetData {
	config: ListFacetConfig
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
	config: DateFacetConfig
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
// export type RangeFacetValues = RangeFacetValue[]

export interface RangeFacetData extends DateAndRangeFacetData {
	interval: number
	config: RangeFacetConfig
	// interval: number
} 
