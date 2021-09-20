import React from 'react'

import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from '../../../utils'

import type { FacetData, FacetsData, ActiveFilter } from '@docere/common'

function hasFilter(facetData: FacetData) {
	if (facetData.filters == null) return false

	if (isListFacetData(facetData) || isBooleanFacetData(facetData) || isHierarchyFacetData(facetData)) {
		return facetData.filters.size > 0
	}
	else if (isRangeFacetData(facetData) || isDateFacetData(facetData)) {
		return Array.isArray(facetData.filters) && facetData.filters.length > 0
		// return facetData.filters.hasOwnProperty('from') && facetData.filters.from != null
	}

	return false
}

// function getFilterValue(facetData: FacetData): string[] {
// 	if (!hasFilter(facetData)) return []

// 	if (isListFacetData(facetData) || isBooleanFacetData(facetData) || isHierarchyFacetData(facetData)) {
// 		return Array.from(facetData.filters)
// 	}
// 	else if (isRangeFacetData(facetData) || isDateFacetData(facetData)) {
// 		const lastFilter = facetData.filters[facetData.filters.length - 1]
// 		return [`${lastFilter.fromLabel} - ${lastFilter.toLabel}`]
// 	}

// 	return []
// }

// export default function useFilters(facetsData: FacetsData) {
// 	const [filters, setFilters] = React.useState<ActiveFilter[]>([])
// 	React.useEffect(() => {
// 		const activeFilters: ActiveFilter[] = []

// 		for (const facetData of facetsData.values()) {
// 			const values = getFilterValue(facetData)

// 			if (values.length) {
// 				activeFilters.push({
// 					id: facetData.config.id,
// 					title: facetData.config.title,
// 					values,
// 				})
// 			}
// 		}

// 		setFilters(activeFilters)
// 	}, [facetsData])
// 	return filters
// }
