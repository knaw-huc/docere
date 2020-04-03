import React from 'react'
import { EsDataType } from '@docere/common'

import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet, isHierarchyFacet } from '../constants'

import type { BooleanFacetConfig, BooleanFacetData, DateFacetConfig, DateFacetData, HierarchyFacetConfig, HierarchyFacetData, ListFacetConfig, ListFacetData, RangeFacetConfig, RangeFacetData, FacetConfigBase, FacetData, FacetedSearchProps, FacetsData, FacetsDataReducerAction } from '@docere/common'

function initBooleanFacet(booleanFacetConfig: BooleanFacetConfig): BooleanFacetData {
	return {
		...booleanFacetConfig,
		filters: new Set(),
		labels: booleanFacetConfig.labels || { true: 'Yes', false: 'No' }
	}
}

function initDateFacet(rangeFacetConfig: DateFacetConfig): DateFacetData {
	return {
		...rangeFacetConfig,
		filters: null,
		interval: null,
	}
}

function initHierarchyFacet(hierarchyFacetConfig: HierarchyFacetConfig): HierarchyFacetData {
	return {
		...hierarchyFacetConfig,
		filters: new Set(),
		size: hierarchyFacetConfig.size || 10,
		viewSize: hierarchyFacetConfig.size || 10,
	}
}

function initListFacet(listFacetConfig: ListFacetConfig): ListFacetData {
	return {
		...listFacetConfig,
		datatype: EsDataType.Keyword, /* Explicitly set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
		filters: new Set(),
		sort: null,
		query: '',
		size: listFacetConfig.size || 10,
		viewSize: listFacetConfig.size || 10,
	}
}

function initRangeFacet(rangeFacetConfig: RangeFacetConfig): RangeFacetData {
	return {
		...rangeFacetConfig,
		filters: null,
		max: null,
		min: null,
	}
}

function initFacet(facetConfig: FacetConfigBase): FacetData {
	if		(isListFacet(facetConfig))		return initListFacet(facetConfig)
	else if (isBooleanFacet(facetConfig))	return initBooleanFacet(facetConfig)
	else if (isHierarchyFacet(facetConfig))	return initHierarchyFacet(facetConfig)
	else if (isRangeFacet(facetConfig))		return initRangeFacet(facetConfig)
	else if (isDateFacet(facetConfig))		return initDateFacet(facetConfig)

	return initListFacet(facetConfig as ListFacetConfig)
}

export function initFacetsData(fields: FacetedSearchProps['fields']) {
	const initMap: FacetsData = new Map()
	return fields
		.reduce((prev, curr) => {
			const facetData = initFacet(curr)

			if (facetData != null) {
				if (facetData.title == null) {
					facetData.title = facetData.id.charAt(0).toUpperCase() + facetData.id.slice(1)
				}
				prev.set(curr.id, facetData)
			}

			return prev
		}, initMap)
}

export default function useFacetsDataReducer(fields: FacetedSearchProps['fields']) {
	const x = React.useReducer(facetsDataReducer, null)

	React.useEffect(() => {
		x[1]({ type: 'clear', fields })
	}, [fields])

	return x
}

function facetsDataReducer(facetsData: FacetsData, action: FacetsDataReducerAction): FacetsData {
	if (action.type === 'clear') {
		return initFacetsData(action.fields)
	}

	const facet = facetsData.get(action.facetId)

	if (isHierarchyFacet(facet)) {
		switch(action.type) {
			case 'remove_filter': {
				const filters = Array.from(facet.filters)
				const nextFilters = filters.slice(0, filters.indexOf(action.value))
				facet.filters = new Set(nextFilters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacet(facet) || isBooleanFacet(facet)) {
		switch(action.type) {
			case 'remove_filter': {
				facet.filters.delete(action.value)
				facet.filters = new Set(facet.filters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacet(facet) || isBooleanFacet(facet) || isHierarchyFacet(facet)) {
		switch(action.type) {
			case 'add_filter': {
				facet.filters = new Set(facet.filters.add(action.value))
				return new Map(facetsData)
			}
		}
	}

	if (isRangeFacet(facet) || isDateFacet(facet)) {
		switch(action.type) {
			case 'set_range': {
				const { type, ...filter } = action
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

	if (isListFacet(facet)) {
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

	if (isListFacet(facet) || isHierarchyFacet(facet)) {
		switch(action.type) {
			case 'view_less': {
				if (facet.viewSize > facet.size) {
					facet.viewSize -= facet.size
					if (facet.viewSize < facet.size) facet.viewSize = facet.size
					return new Map(facetsData)
				}
				break
			}

			case 'view_more': {
				if (action.total - facet.viewSize > 0) {
					facet.viewSize += facet.size
					return new Map(facetsData)
				}
				break
			}
		}
	}

	return facetsData
}
