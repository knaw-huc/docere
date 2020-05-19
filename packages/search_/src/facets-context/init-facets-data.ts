import { isListFacetConfig, isBooleanFacetConfig, isHierarchyFacetConfig, isRangeFacetConfig, isDateFacetConfig } from '../utils'

import type { FacetConfig, FacetsConfig, BooleanFacetConfig, BooleanFacetData, DateFacetConfig, DateFacetData, HierarchyFacetConfig, HierarchyFacetData, ListFacetConfig, ListFacetData, RangeFacetConfig, RangeFacetData, FacetData, FacetsData } from '@docere/common'
import { getRangeBucketSize } from '../use-search/get-buckets'

function initBooleanFacet(config: BooleanFacetConfig): BooleanFacetData {
	return {
		config,
		filters: new Set(),
	}
}

function initHierarchyFacet(config: HierarchyFacetConfig): HierarchyFacetData {
	return {
		config,
		filters: new Set(),
		size: config.size
	}
}

function initListFacet(config: ListFacetConfig): ListFacetData {
	return {
		config,
		filters: new Set(),
		query: '',
		size: config.size,
		sort: config.sort,
	}
}

function initDateFacet(config: DateFacetConfig): DateFacetData {
	console.log('c', config)
	return {
		collapseFilters: config.collapseFilters,
		config,
		filters: [],
		interval: config.interval,
		value: null,
	}
}

function initRangeFacet(config: RangeFacetConfig): RangeFacetData {
	return {
		collapseFilters: config.collapseFilters,
		config,
		filters: [],
		interval: getRangeBucketSize(config.range),
		value: null,
	}
}

function initFacetData(facetConfig: FacetConfig): FacetData {
	if		(isListFacetConfig(facetConfig))		return initListFacet(facetConfig)
	else if (isBooleanFacetConfig(facetConfig))		return initBooleanFacet(facetConfig)
	else if (isHierarchyFacetConfig(facetConfig))	return initHierarchyFacet(facetConfig)
	else if (isRangeFacetConfig(facetConfig))		return initRangeFacet(facetConfig)
	else if (isDateFacetConfig(facetConfig))		return initDateFacet(facetConfig)
}

export default function initFacetsData(facetsConfig: FacetsConfig) {
	const initMap: FacetsData = new Map()
	return Object.keys(facetsConfig)
		.reduce((prev, field) => {
			const facetData = initFacetData(facetsConfig[field])
			prev.set(facetData.config.id, facetData)
			return prev
		}, initMap)
}
