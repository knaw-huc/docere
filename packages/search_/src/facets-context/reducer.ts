import React from 'react'

import extendFacetConfig from '../extend-facet-config'
import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from '../utils'
import initFacetsData from './init-facets-data'
import { initialSearchContextState } from './index'

import type { FacetsConfig, FacetsDataReducerAction } from '@docere/common'
import type { FacetsState } from './index'
import { getRangeBucketSize } from '../use-search/get-buckets'

export default function useFacetsDataReducer(facetsConfig: FacetsConfig) {
	const x = React.useReducer(facetsDataReducer, initialSearchContextState)

	React.useEffect(() => {
		if (!Object.keys(facetsConfig).length) return
		x[1]({ type: 'SET_CONFIG', facetsConfig: extendFacetConfig(facetsConfig) })
	}, [facetsConfig])

	return x
}

//@ts-ignore
// window.DEBUG = true
function facetsDataReducer(state: FacetsState, action: FacetsDataReducerAction): FacetsState {
	 if ((window as any).DEBUG) console.log('[SearchContext]', action)

	if (action.type === 'SET_CONFIG') {
		return {
			...state,
			facetsConfig: action.facetsConfig,
			facets: initFacetsData(action.facetsConfig)
		}
	}

	if (action.type === 'RESET') {
		return {
			...state,
			facets: initFacetsData(state.facetsConfig),
			query: ''
		}
		
	}

	if (action.type === 'SET_QUERY') {
		return {
			...state,
			query: action.value
		}
	}

	const facet = state.facets.get(action.facetId)

	if (isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'REMOVE_SEARCH_FILTER': {
				const filters = Array.from(facet.filters)
				const nextFilters = filters.slice(0, filters.indexOf(action.value))
				facet.filters = new Set(nextFilters)

				return {
					...state,
					facets: new Map(state.facets)
				}
			}
		}
	}

	if (isListFacetData(facet) || isBooleanFacetData(facet)) {
		switch(action.type) {
			case 'REMOVE_SEARCH_FILTER': {
				facet.filters.delete(action.value)
				facet.filters = new Set(facet.filters)

				return {
					...state,
					facets: new Map(state.facets)
				}
			}
		}
	}

	if (isListFacetData(facet) || isBooleanFacetData(facet) || isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'ADD_SEARCH_FILTER': {
				if (Array.isArray(action.value)) action.value.forEach(v => facet.filters.add(v))
				else facet.filters.add(action.value)
				facet.filters = new Set(facet.filters)

				return {
					...state,
					facets: new Map(state.facets)
				}
			}

			case 'SET_SEARCH_FILTER': {
				const facets = initFacetsData(state.facetsConfig)
				const facet = facets.get(action.facetId)
				const nextFilters = Array.isArray(action.value) ? action.value : [action.value]
				facet.filters = new Set(nextFilters)

				return {
					...state,
					facets,
					query: ''
				}
			}
		}
	}

	if (isRangeFacetData(facet) || isDateFacetData(facet)) {
		switch(action.type) {
			case 'SET_RANGE': {
				const index = facet.filters.findIndex(f => f.from === action.value.from && f.to === action.value.to)
				if (index !== -1) facet.filters = facet.filters.slice(0, index + 1)
				else facet.filters = facet.filters.concat(action.value)

				if (isRangeFacetData(facet)) {
					console.log(index, action, facet.filters)
					facet.interval = getRangeBucketSize(action.value.to - action.value.from)
				}

				return {
					...state,
					facets: new Map(state.facets)
				}
			}

			case 'RESET_RANGE': {
				facet.filters = []
				if (isRangeFacetData(facet)) facet.interval = getRangeBucketSize(facet.config.range)

				return {
					...state,
					facets: new Map(state.facets)
				}
			}
		}
	}

	if (isListFacetData(facet)) {
		switch(action.type) {
			case 'set_query': {
				facet.query = action.value

				return {
					...state,
					facets: new Map(state.facets)
				}
			}

			case 'set_sort': {
				facet.sort = { by: action.by,  direction: action.direction }

				return {
					...state,
					facets: new Map(state.facets)
				}
			}
		}
	}

	if (isListFacetData(facet) || isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'view_less': {
				if (facet.size > facet.config.size) {
					facet.size -= facet.config.size
					if (facet.size < facet.config.size) facet.size = facet.config.size

					return {
						...state,
						facets: new Map(state.facets)
					}
				}
				break
			}

			case 'view_more': {
				if (action.total - facet.size > 0) {
					facet.size += facet.config.size

					return {
						...state,
						facets: new Map(state.facets)
					}
				}
				break
			}
		}
	}

	return state
}
