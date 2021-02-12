import { SortBy, SortDirection, EsDataType, RangeFacetConfig, DateFacetConfig } from '@docere/common'

import { isListFacetConfig, isBooleanFacetConfig, isHierarchyFacetConfig, isRangeFacetConfig, isDateFacetConfig } from './utils'

import type { BooleanFacetConfig, HierarchyFacetConfig, ListFacetConfig, FacetConfig, FacetsConfig } from '@docere/common'

function extendBooleanFacet(config: BooleanFacetConfig): BooleanFacetConfig {
	return {
		labels: { true: 'Yes', false: 'No' },
		...config,
	}
}

function extendHierarchyFacet(config: HierarchyFacetConfig): HierarchyFacetConfig {
	return {
		...config,
		size: config.size || 10, /* if size is null, default to 10 */
	}
}

const defaultSort = {
	by: SortBy.Count,
	direction: SortDirection.Desc
}

function extendListFacet(config: ListFacetConfig): ListFacetConfig {
	if (config.sort == null) delete config.sort

	return {
		sort: defaultSort,
		...config,
		size: config.size || 10, /* if size is null, default to 10 */
		datatype: EsDataType.Keyword, /* Explicitly set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
	}
}

function extendRangeFacet(config: RangeFacetConfig): RangeFacetConfig {
	return {
		collapseFilters: true,
		...config,
	}
}

function extendDateFacet(config: DateFacetConfig): DateFacetConfig {
	return {
		collapseFilters: true,
		...config,
	}
}

function initFacet(facetConfig: FacetConfig): FacetConfig {
	if		(isListFacetConfig(facetConfig))		return extendListFacet(facetConfig)
	else if (isBooleanFacetConfig(facetConfig))		return extendBooleanFacet(facetConfig)
	else if (isHierarchyFacetConfig(facetConfig))	return extendHierarchyFacet(facetConfig)
	else if (isRangeFacetConfig(facetConfig))		return extendRangeFacet(facetConfig)
	else if (isDateFacetConfig(facetConfig))		return extendDateFacet(facetConfig)

	console.error(`Facet config with datatype: '${facetConfig.datatype}' not found!`)
}

export function extendFacetConfig(facetsConfig: FacetsConfig) {
	for (const facetId of Object.keys(facetsConfig)) {
		const facetConfig = facetsConfig[facetId]
		const extendedFacetConfig = initFacet(facetConfig)

		if (extendedFacetConfig.title == null) {
			extendedFacetConfig.title = extendedFacetConfig.id.charAt(0).toUpperCase() + extendedFacetConfig.id.slice(1)
		}

		facetsConfig[facetId] = extendedFacetConfig
	}

	return facetsConfig
}
