import * as React from 'react'
import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet, isHierarchyFacet } from '../../../constants'
import { formatDate } from '../../facets/date/utils'
import type { FacetData, FacetsData, ActiveFilter } from '@docere/common'

function hasFilter(facetData: FacetData) {
	if (facetData.filters == null) return false

	if (isListFacet(facetData) || isBooleanFacet(facetData) || isHierarchyFacet(facetData)) {
		return facetData.filters.size > 0
	}
	else if (isRangeFacet(facetData) || isDateFacet(facetData)) {
		return facetData.filters.hasOwnProperty('from') && facetData.filters.from != null
	}

	return false
}

function getFilterValue(facetData: FacetData): string[] {
	if (!hasFilter(facetData)) return []

	if (isListFacet(facetData) || isBooleanFacet(facetData) || isHierarchyFacet(facetData)) {
		return Array.from(facetData.filters)
	}
	else if (isRangeFacet(facetData)) {
		return [`${facetData.filters.from} - ${facetData.filters.to}`]
	}
	else if (isDateFacet(facetData)) {
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
					id: facetData.id,
					title: facetData.title,
					values,
				})
			}
		}

		setFilters(activeFilters)
	}, [facetsData])
	return filters
}
