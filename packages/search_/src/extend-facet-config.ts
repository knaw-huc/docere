import { SortBy, SortDirection, EsDataType } from '@docere/common'

import { isListFacetConfig, isBooleanFacetConfig, isHierarchyFacetConfig, isRangeFacetConfig, isDateFacetConfig } from './utils'

import type { FacetedSearchProps, BooleanFacetConfig, HierarchyFacetConfig, ListFacetConfig, FacetConfig, FacetedSearchContext } from '@docere/common'

function extendBooleanFacet(config: BooleanFacetConfig): BooleanFacetConfig {
	return {
		labels: { true: 'Yes', false: 'No' },
		...config,
	}
}

function extendHierarchyFacet(config: HierarchyFacetConfig): HierarchyFacetConfig {
	return {
		size: 10,
		...config,
	}
}

function extendListFacet(config: ListFacetConfig): ListFacetConfig {
	const sort = {
		by: SortBy.Count,
		direction: SortDirection.Desc
	}

	return {
		size: 10,
		sort,
		...config,
		datatype: EsDataType.Keyword, /* Explicitly set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
	}
}

function initFacet(facetConfig: FacetConfig): FacetConfig {
	if		(isListFacetConfig(facetConfig))		return extendListFacet(facetConfig)
	else if (isBooleanFacetConfig(facetConfig))		return extendBooleanFacet(facetConfig)
	else if (isHierarchyFacetConfig(facetConfig))	return extendHierarchyFacet(facetConfig)
	else if (isRangeFacetConfig(facetConfig))		return facetConfig
	else if (isDateFacetConfig(facetConfig))		return facetConfig

	console.error(`Facet config with datatype: '${facetConfig.datatype}' not found!`)
}

export default function extendFacetConfig(facetsConfig: FacetedSearchProps['fields']) {
	return facetsConfig
		.reduce((prev, facetConfig) => {
			const extendedFacetConfig = initFacet(facetConfig)

			if (extendedFacetConfig.title == null) {
				extendedFacetConfig.title = extendedFacetConfig.id.charAt(0).toUpperCase() + extendedFacetConfig.id.slice(1)
			}

			prev[extendedFacetConfig.id] = extendedFacetConfig
			return prev
		}, {} as FacetedSearchContext['facetsConfig'])
}
