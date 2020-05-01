import type { FacetsConfig } from '.'
import type { RangeFacetFilter } from './facets'
import { SortBy, SortDirection } from '../../enum'

// TODO move back from common to search_?

interface SetConfig {
	type: 'SET_CONFIG'
	facetsConfig: FacetsConfig
}

// interface FacetsDataReducerActionClear {
// 	type: 'clear'
// 	activeFilters: FacetedSearchContext['activeFilters']
// 	fields: FacetedSearchContext['facetsConfig']
// }

interface FacetsDataReducerActionAddFilter {
	type: 'ADD_SEARCH_FILTER'
	facetId: string
	value: string
}

interface SetSearchFilter {
	type: 'SET_SEARCH_FILTER'
	facetId: string
	value: string
}

interface FacetsDataReducerActionRemoveFilter {
	type: 'REMOVE_SEARCH_FILTER'
	facetId: string
	value: string
}

interface SetQuery {
	type: 'SET_QUERY',
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

interface Reset {
	type: 'RESET'
}

export type FacetsDataReducerAction =
	Reset |
	SetConfig |
	SetSearchFilter |
	SetQuery |
	// FacetsDataReducerActionClear |
	FacetsDataReducerActionAddFilter |
	FacetsDataReducerActionRemoveFilter |
	FacetsDataReducerActionSetSort |
	FacetsDataReducerActionSetQuery |
	FacetsDataReducerActionViewLess |
	FacetsDataReducerActionViewMore |
	FacetsDataReducerActionSetRange
