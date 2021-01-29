import React from 'react'
import { initialSearchContextState } from '@docere/common'

import extendFacetConfig from '../extend-facet-config'
import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from '../utils'
import { getRangeBucketSize } from '../use-search/get-buckets'
import initFacetsData from './init-facets-data'

import type { FacetsConfig, FacetsState, FacetsDataReducerAction, RangeFacetValue } from '@docere/common'


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
			case 'REMOVE_FILTER': {
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
			case 'REMOVE_FILTER': {
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
			case 'ADD_FILTER': {
				const value = action.value as string
				if (Array.isArray(action.value)) action.value.forEach(v => facet.filters.add(v))
				else facet.filters.add(value)
				facet.filters = new Set(facet.filters)

				return {
					...state,
					facets: new Map(state.facets)
				}
			}

			case 'SET_FILTER': {
				const facets = initFacetsData(state.facetsConfig)
				const facet = facets.get(action.facetId)
				const nextFilters = Array.isArray(action.value) ? action.value : [action.value] as string[]
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
			case 'SET_FILTER': {
				// Cast value to RangeFacetValue
				const value = action.value as RangeFacetValue

				// Find the index to see if the filter is already active
				const index = facet.filters.findIndex(f => f.from === value.from && f.to === value.to)

				// If the current active range (from the initial range or an active filter)
				// is equal to the requested filter, nothing has to be done, return the state unchanged
				if (
					(!facet.filters.length && facet.value.from === value.from && facet.value.to === value.to) ||
					(index > -1 && index === facet.filters.length - 1)
				) {
					return state
				}

				// If filters are to be collapsed, only keep action.value
				if (facet.config.collapseFilters) {
					facet.filters = [value]
				}

				// If there is at least 1 filter active and the requested range is outside
				// of the currently active range, remove all filters and only keep the new range
				else if (
					facet.filters.length &&
					(
						value.from < facet.filters[facet.filters.length - 1].from ||
						value.to > facet.filters[facet.filters.length - 1].to
					)
				) {
					facet.filters = [value]
				}

				// If the filter is already active remove filters with smaller range
				else if (index !== -1) {
					facet.filters = facet.filters.slice(0, index + 1)
				}

				// If filters are not te be collapsed, concat action.value to the existing filters
				else {
 					facet.filters = facet.filters.concat(value)
				}

				// Update the interval based on the new range
				if (isRangeFacetData(facet)) {
					facet.interval = getRangeBucketSize(value.to - value.from)
				}

				return {
					...state,
					facets: new Map(state.facets)
				}
			}

			case 'REMOVE_FILTER': {
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
