import { SortBy, SortDirection, EsDataType, BaseMetadataConfig, ListMetadataConfig, BooleanMetadataConfig, DateMetadataConfig, HierarchyMetadataConfig, RangeMetadataConfig } from '@docere/common'

import { isListMetadataConfig, isDateMetadataConfig, isBooleanMetadataConfig, isHierarchyMetadataConfig, isRangeMetadataConfig } from '@docere/common'

import type { FacetsConfig } from '@docere/common'

function extendBooleanFacet(config: BooleanMetadataConfig): BooleanMetadataConfig {
	config.facet = {
		labels: { true: 'Yes', false: 'No' },
		...config.facet,
	}

	return config 
}

function extendHierarchyFacet(config: HierarchyMetadataConfig): HierarchyMetadataConfig {
	config.facet = {
		...config.facet,
		size: config.facet.size || 10, /* if size is null, default to 10 */
	}

	return config
}

const defaultSort = {
	by: SortBy.Count,
	direction: SortDirection.Desc
}

function extendListFacet(config: ListMetadataConfig): ListMetadataConfig {
	if (config.facet.sort == null) delete config.facet.sort

	config.facet = {
		sort: defaultSort,
		...config.facet,
		size: config.facet.size || 10, /* if size is null, default to 10 */
		datatype: EsDataType.Keyword, /* Explicitly set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
	}

	return config
}

function extendRangeFacet(config: RangeMetadataConfig): RangeMetadataConfig {
	config.facet = {
		collapseFilters: true,
		...config.facet,
	}

	return config
}

function extendDateFacet(config: DateMetadataConfig): DateMetadataConfig {
	config.facet = {
		collapseFilters: true,
		...config.facet,
	}

	return config
}

function initFacet(metadataConfig: BaseMetadataConfig): BaseMetadataConfig {
	if		(isListMetadataConfig(metadataConfig))		return extendListFacet(metadataConfig)
	else if (isBooleanMetadataConfig(metadataConfig))	return extendBooleanFacet(metadataConfig)
	else if (isHierarchyMetadataConfig(metadataConfig))	return extendHierarchyFacet(metadataConfig)
	else if (isRangeMetadataConfig(metadataConfig))		return extendRangeFacet(metadataConfig)
	else if (isDateMetadataConfig(metadataConfig))		return extendDateFacet(metadataConfig)

	console.error(`Facet config with datatype: '${metadataConfig.facet.datatype}' not found!`)
}

export function extendFacetConfig(facetsConfig: FacetsConfig) {
	for (const facetId of Object.keys(facetsConfig)) {
		const facetConfig = facetsConfig[facetId]
		const extendedFacetConfig = initFacet(facetConfig)

		facetsConfig[facetId] = extendedFacetConfig
	}

	return facetsConfig
}
