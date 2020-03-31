import type { AppProps } from '.'
import type { RangeFacetFilter } from './facets'
import { SortBy, SortDirection } from '../../enum'

interface FacetsDataReducerActionClear {
	type: 'clear'
	fields: AppProps['fields']
}

interface FacetsDataReducerActionAddFilter {
	type: 'add_filter'
	facetId: string
	value: string
}

interface FacetsDataReducerActionRemoveFilter {
	type: 'remove_filter'
	facetId: string
	value: string
}

interface FacetsDataReducerActionSetSort {
	type: 'set_sort'
	facetId: string
	by: SortBy
	direction: SortDirection
}

interface FacetsDataReducerActionSetQuery {
	type: 'set_query'
	facetId: string
	value: string
}

interface FacetsDataReducerActionViewLess {
	type: 'view_less'
	facetId: string
}

interface FacetsDataReducerActionViewMore {
	type: 'view_more'
	facetId: string
	total: number
}

type FacetsDataReducerActionSetRange = RangeFacetFilter & {
	facetId: string
	type: 'set_range'
}

export type FacetsDataReducerAction =
	FacetsDataReducerActionClear |
	FacetsDataReducerActionAddFilter |
	FacetsDataReducerActionRemoveFilter |
	FacetsDataReducerActionSetSort |
	FacetsDataReducerActionSetQuery |
	FacetsDataReducerActionViewLess |
	FacetsDataReducerActionViewMore |
	FacetsDataReducerActionSetRange
