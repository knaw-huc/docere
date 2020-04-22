import React from 'react'

import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from '../../../utils'
import { formatDate } from '../../facets/date/utils'

import type { FacetData, FacetsData, ActiveFilter } from '@docere/common'

function hasFilter(facetData: FacetData) {
	if (facetData.filters == null) return false

	if (isListFacetData(facetData) || isBooleanFacetData(facetData) || isHierarchyFacetData(facetData)) {
		return facetData.filters.size > 0
	}
	else if (isRangeFacetData(facetData) || isDateFacetData(facetData)) {
		return facetData.filters.hasOwnProperty('from') && facetData.filters.from != null
	}

	return false
}

function getFilterValue(facetData: FacetData): string[] {
	if (!hasFilter(facetData)) return []

	if (isListFacetData(facetData) || isBooleanFacetData(facetData) || isHierarchyFacetData(facetData)) {
		return Array.from(facetData.filters)
	}
	else if (isRangeFacetData(facetData)) {
		return [`${facetData.filters.from} - ${facetData.filters.to}`]
	}
	else if (isDateFacetData(facetData)) {
		return [`${formatDate(facetData.filters.from, facetData.interval)} - ${formatDate(facetData.filters.to, facetData.interval)}`]
	}

	return []
}

export default function useFilters(facetsData: FacetsData) {
	const [filters, setFilters] = React.useState<ActiveFilter[]>([])
	React.useEffect(() => {
		const activeFilters: ActiveFilter[] = []

		for (const facetData of facetsData.values()) {
			const values = getFilterValue(facetData)

			if (values.length) {
				activeFilters.push({
					id: facetData.config.id,
					title: facetData.config.title,
					values,
				})
			}
		}

		setFilters(activeFilters)
	}, [facetsData])
	return filters
}
