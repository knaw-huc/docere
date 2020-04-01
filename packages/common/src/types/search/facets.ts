import { EsDataType, SortBy, SortDirection } from "../../enum"
import { BaseConfig } from '../config-data/config'

export type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValues

export type FacetData = ListFacetData | BooleanFacetData | HierarchyFacetData | RangeFacetData | DateFacetData
export type FacetsData = Map<string, FacetData>

// interface FacetProps {
// 	id: string
// 	title: string
// }

/*
 * FacetConfigBase is defined in @docere/common because it is also the
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

// BOOLEAN FACET
export interface BooleanFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Boolean
	readonly labels?: { false: string, true: string }
}

export type BooleanFacetData = BooleanFacetConfig & {
	filters: Set<string>
} 

export type BooleanFacetValues = [
	{ key: 'true', count: number},
	{ key: 'false', count: number}
]

// DATE FACET
export interface DateFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Date
}

export interface DateFacetData extends DateFacetConfig {
	filters: RangeFacetFilter,
	interval?: 'year' | 'month' | 'day'
} 

// HIERARCHY FACET
export interface HierarchyFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Hierarchy
	readonly size?: number
}

export type HierarchyFacetData = HierarchyFacetConfig & {
	filters: Set<string>
	viewSize: number
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
	readonly size?: number
}

export interface KeyCount {
	key: string,
	count: number
}

export type ListFacetData = ListFacetConfig & {
	filters: Set<string>
	query: string
	sort: {
		by: SortBy,
		direction: SortDirection,
	}
	viewSize: number
} 

export interface ListFacetValues {
	total: number
	values: KeyCount[]
}

// RANGE FACET
export interface RangeFacetConfig extends FacetConfigBase {
	readonly datatype: EsDataType.Integer
	readonly interval: number,
}

export interface RangeFacetFilter {
	from: number
	to?: number
}

interface RangeKeyCount {
	key: number,
	count: number
}
export type RangeFacetValues = RangeKeyCount[]

export interface RangeFacetData extends RangeFacetConfig {
	filters: RangeFacetFilter,
	min: number,
	max: number
} 