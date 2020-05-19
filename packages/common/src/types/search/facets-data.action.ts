import type { FacetsConfig } from '.'
import type { RangeFacetValue } from './facets'
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
	type: 'ADD_FILTER'
	facetId: string
	value: string | string[] | RangeFacetValue
}

interface SetSearchFilter {
	type: 'SET_FILTER'
	facetId: string
	value: string | string[] | RangeFacetValue
}

interface FacetsDataReducerActionRemoveFilter {
	type: 'REMOVE_FILTER'
	facetId: string
	value?: string
}

// type SetRange = {
// 	facetId: string
// 	type: 'SET_RANGE'
// 	value: RangeFacetValue
// }

// type ResetRange = {
// 	facetId: string
// 	type: 'RESET_RANGE'
// }

// TODO change to SET_FULL_TEXT_QUERY
interface SetQuery {
	type: 'SET_QUERY',
	value: string
}

// TODO change to SET_LIST_FACET_SORT
interface FacetsDataReducerActionSetSort {
	type: 'set_sort'
	facetId: string
	by: SortBy
	direction: SortDirection
}

// TODO change to SET_LIST_FACET_QUERY
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
	FacetsDataReducerActionViewMore
