import { ListFacetFilter, RangeFacetFilter } from '@docere/common'

import { isListFacetConfig, isBooleanFacetConfig, isHierarchyFacetConfig, isRangeFacetConfig, isDateFacetConfig } from '../utils'

import type { FacetConfig, FacetedSearchContext, BooleanFacetConfig, BooleanFacetData, DateFacetConfig, DateFacetData, HierarchyFacetConfig, HierarchyFacetData, ListFacetConfig, ListFacetData, RangeFacetConfig, RangeFacetData, FacetData, FacetsData } from '@docere/common'

function initBooleanFacet(config: BooleanFacetConfig, activeFilters: FacetedSearchContext['activeFilters']): BooleanFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as ListFacetFilter : new Set<string>()

	return {
		config,
		filters,
	}
}

function initDateFacet(config: DateFacetConfig, activeFilters: FacetedSearchContext['activeFilters']): DateFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as RangeFacetFilter : null
	return {
		config,
		filters,
	}
}

function initHierarchyFacet(config: HierarchyFacetConfig, activeFilters: FacetedSearchContext['activeFilters']): HierarchyFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as ListFacetFilter : new Set<string>()

	return {
		config,
		filters,
		size: config.size
	}
}

function initListFacet(config: ListFacetConfig, activeFilters: FacetedSearchContext['activeFilters']): ListFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as ListFacetFilter : new Set<string>()

	return {
		config,
		filters,
		query: '',
		size: config.size,
		sort: config.sort,
	}
}

function initRangeFacet(config: RangeFacetConfig, activeFilters: FacetedSearchContext['activeFilters']): RangeFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as RangeFacetFilter : null

	return {
		config,
		filters,
		max: null,
		min: null,
	}
}

function initFacetData(facetConfig: FacetConfig, activeFilters: FacetedSearchContext['activeFilters']): FacetData {
	if		(isListFacetConfig(facetConfig))		return initListFacet(facetConfig, activeFilters)
	else if (isBooleanFacetConfig(facetConfig))		return initBooleanFacet(facetConfig, activeFilters)
	else if (isHierarchyFacetConfig(facetConfig))	return initHierarchyFacet(facetConfig, activeFilters)
	else if (isRangeFacetConfig(facetConfig))		return initRangeFacet(facetConfig, activeFilters)
	else if (isDateFacetConfig(facetConfig))		return initDateFacet(facetConfig, activeFilters)
}

export default function initFacetsData(fields: FacetedSearchContext['facetsConfig'], activeFilters: FacetedSearchContext['activeFilters']) {
	const initMap: FacetsData = new Map()
	return Object.keys(fields)
		.reduce((prev, field) => {
			const facetData = initFacetData(fields[field], activeFilters)
			prev.set(facetData.config.id, facetData)
			return prev
		}, initMap)
}
