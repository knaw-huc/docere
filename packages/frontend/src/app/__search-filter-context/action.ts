import type { FacetedSearchContext } from '@docere/common'

interface SetSearchQuery {
	type: 'SET_SEARCH_QUERY'
	query: string[]
}

interface SetSearchFilter {
	type: 'SET_SEARCH_FILTER'
	facetId: string
	value: string
}

interface AddSearchFilter {
	type: 'ADD_SEARCH_FILTER'
	facetId: string
	value: string
}

interface RemoveSearchFilter {
	type: 'REMOVE_SEARCH_FILTER'
	facetId: string
	value: string
}

interface UpdateSearchFilters {
	type: 'UPDATE_SEARCH_FILTERS'
	filters: FacetedSearchContext['activeFilters']
}

export type SearchFilterAction = 
	AddSearchFilter |
	RemoveSearchFilter |
	SetSearchFilter |
	SetSearchQuery |
	UpdateSearchFilters
