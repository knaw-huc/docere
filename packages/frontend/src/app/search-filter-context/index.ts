// import * as React from 'react'

// import type { FacetedSearchContext } from '@docere/common'
// import type { SearchFilterAction } from './action'

// export const initialSearchFilterState: SearchFilterState = {
// 	externalFilters: {},
// 	filters: {},
// 	query: null
// }

// export function searchFilterReducer(state: SearchFilterState, action: SearchFilterAction): SearchFilterState {
// 	if ((window as any).DEBUG) console.log('[SearchFilterContext]', action)

// 	switch (action.type) {
// 		case 'ADD_SEARCH_FILTER': {
// 			const currentValues = state.externalFilters.hasOwnProperty(action.facetId) ?
// 				state.externalFilters[action.facetId] :
// 				new Set()

// 			currentValues.add(action.value)
			
// 			return {
// 				...state,
// 				externalFilters: {
// 					...state.externalFilters,
// 					[action.facetId]: new Set(currentValues)
// 				},
// 				// viewport: Viewport.EntrySelector
// 			}
// 		}

// 		case 'SET_SEARCH_FILTER': {
// 			return {
// 				...state,
// 				externalFilters: {
// 					[action.facetId]: new Set([action.value])
// 				},
// 				// viewport: Viewport.EntrySelector
// 			}
// 		}

// 		case 'REMOVE_SEARCH_FILTER': {
// 			const currentValues = state.externalFilters[action.facetId]
// 			currentValues.delete(action.value)
			
// 			return {
// 				...state,
// 				externalFilters: {
// 					...state.externalFilters,
// 					[action.facetId]: new Set(currentValues)
// 				},
// 				// viewport: Viewport.EntrySelector
// 			}
// 		}

// 		case 'UPDATE_SEARCH_FILTERS': {
// 			return {
// 				...state,
// 				filters: action.filters
// 			}
// 		}

// 		case 'SET_SEARCH_QUERY': {
// 			// if searchTab is Search, viewport has to be EntrySelector
// 			// and if searchTab is Results, viewport has to be Entry

// 			return {
// 				...state,
// 				query: action.query,
// 			}
// 		}

// 		default:
// 			break
// 	}

// 	return state
// }

// interface SearchFilterState {
// 	externalFilters: FacetedSearchContext['activeFilters']
// 	filters: FacetedSearchContext['activeFilters']
// 	query: string[]
// }
// interface SearchFilterContext {
// 	state: SearchFilterState
// 	dispatch: React.Dispatch<SearchFilterAction>
// }
// const SearchFilterContext = React.createContext<SearchFilterContext>(null)
// export default SearchFilterContext

