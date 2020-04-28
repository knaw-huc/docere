import React from 'react'

import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from '../utils'
import initFacetsData from './init-facets-data'

import type { FacetedSearchContext, FacetsData, FacetsDataReducerAction } from '@docere/common'

export default function useFacetsDataReducer(fields: FacetedSearchContext['facetsConfig'], activeFilters: FacetedSearchContext['activeFilters']) {
	const x = React.useReducer(facetsDataReducer, null)

	React.useEffect(() => {
		x[1]({ type: 'clear', fields, activeFilters })
	}, [fields])

	return x
}

function facetsDataReducer(facetsData: FacetsData, action: FacetsDataReducerAction): FacetsData {
	if (action.type === 'clear') {
		return initFacetsData(action.fields, action.activeFilters)
	}

	const facet = facetsData.get(action.facetId)

	if (isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'remove_filter': {
				const filters = Array.from(facet.filters)
				const nextFilters = filters.slice(0, filters.indexOf(action.value))
				facet.filters = new Set(nextFilters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacetData(facet) || isBooleanFacetData(facet)) {
		switch(action.type) {
			case 'remove_filter': {
				facet.filters.delete(action.value)
				facet.filters = new Set(facet.filters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacetData(facet) || isBooleanFacetData(facet) || isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'add_filter': {
				facet.filters = new Set(facet.filters.add(action.value))
				return new Map(facetsData)
			}
		}
	}

	if (isRangeFacetData(facet) || isDateFacetData(facet)) {
		switch(action.type) {
			case 'set_range': {
				const { type, facetId, ...filter } = action
				facet.filters = filter
				return new Map(facetsData)
			}

			case 'remove_filter': {
				// const { type, ...filter } = action
				facet.filters = null
				return new Map(facetsData)
			}
		}
	}

	if (isListFacetData(facet)) {
		switch(action.type) {
			case 'set_query': {
				facet.query = action.value
				return new Map(facetsData)
			}

			case 'set_sort': {
				facet.sort = { by: action.by,  direction: action.direction }
				return new Map(facetsData)
			}
		}
	}

	if (isListFacetData(facet) || isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'view_less': {
				if (facet.size > facet.config.size) {
					facet.size -= facet.config.size
					if (facet.size < facet.config.size) facet.size = facet.config.size
					return new Map(facetsData)
				}
				break
			}

			case 'view_more': {
				if (action.total - facet.size > 0) {
					facet.size += facet.config.size
					return new Map(facetsData)
				}
				break
			}
		}
	}

	return facetsData
}
