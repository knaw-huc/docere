import { isBooleanMetadataConfig, isDateMetadataConfig, isHierarchyMetadataConfig, isListMetadataConfig, isRangeMetadataConfig } from '../utils'

import type { FacetsConfig, BooleanFacetData, DateFacetData, HierarchyFacetData, ListFacetData, RangeFacetData, FacetData, FacetsData, BaseMetadataConfig, BooleanMetadataConfig, HierarchyMetadataConfig, ListMetadataConfig, DateMetadataConfig, RangeMetadataConfig } from '@docere/common'
import { getRangeBucketSize } from '../use-search/get-buckets'

function initBooleanFacet(config: BooleanMetadataConfig): BooleanFacetData {
	return {
		config,
		filters: new Set(),
	}
}

function initHierarchyFacet(config: HierarchyMetadataConfig): HierarchyFacetData {
	return {
		config,
		filters: new Set(),
		size: config.facet.size
	}
}

function initListFacet(config: ListMetadataConfig): ListFacetData {
	return {
		config,
		filters: new Set(),
		query: '',
		size: config.facet.size,
		sort: config.facet.sort,
	}
}

function initDateFacet(config: DateMetadataConfig): DateFacetData {
	return {
		collapseFilters: config.facet.collapseFilters,
		config,
		filters: [],
		interval: config.facet.interval,
		value: null,
	}
}

function initRangeFacet(config: RangeMetadataConfig): RangeFacetData {
	return {
		collapseFilters: config.facet.collapseFilters,
		config,
		filters: [],
		interval: getRangeBucketSize(config.facet.range),
		value: null,
	}
}

function initFacetData(metadataConfig: BaseMetadataConfig): FacetData {
	if		(isListMetadataConfig(metadataConfig))		return initListFacet(metadataConfig)
	else if (isBooleanMetadataConfig(metadataConfig))	return initBooleanFacet(metadataConfig)
	else if (isHierarchyMetadataConfig(metadataConfig))	return initHierarchyFacet(metadataConfig)
	else if (isRangeMetadataConfig(metadataConfig))		return initRangeFacet(metadataConfig)
	else if (isDateMetadataConfig(metadataConfig))		return initDateFacet(metadataConfig)
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
