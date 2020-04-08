import React from 'react'
import { EsDataType, ListFacetFilter, RangeFacetFilter } from '@docere/common'

import { isListFacet, isBooleanFacet, isRangeFacet, isDateFacet, isHierarchyFacet } from '../constants'

import type { BooleanFacetConfig, BooleanFacetData, DateFacetConfig, DateFacetData, HierarchyFacetConfig, HierarchyFacetData, ListFacetConfig, ListFacetData, RangeFacetConfig, RangeFacetData, FacetConfigBase, FacetData, FacetedSearchProps, FacetsData, FacetsDataReducerAction } from '@docere/common'

function initBooleanFacet(config: BooleanFacetConfig, activeFilters: FacetedSearchProps['activeFilters']): BooleanFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as ListFacetFilter : new Set<string>()

	return {
		...config,
		filters,
		labels: config.labels || { true: 'Yes', false: 'No' }
	}
}

function initDateFacet(config: DateFacetConfig, activeFilters: FacetedSearchProps['activeFilters']): DateFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as RangeFacetFilter : null
	return {
		...config,
		filters,
		interval: null,
	}
}

function initHierarchyFacet(config: HierarchyFacetConfig, activeFilters: FacetedSearchProps['activeFilters']): HierarchyFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as ListFacetFilter : new Set<string>()

	return {
		...config,
		filters,
		size: config.size || 10,
		viewSize: config.size || 10,
	}
}

function initListFacet(config: ListFacetConfig, activeFilters: FacetedSearchProps['activeFilters']): ListFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as ListFacetFilter : new Set<string>()

	return {
		...config,
		datatype: EsDataType.Keyword, /* Explicitly set the datatype, for it is the default; facetConfig's without a datatype are converted to ListFacet's */
		filters,
		sort: null,
		query: '',
		size: config.size || 10,
		viewSize: config.size || 10,
	}
}

function initRangeFacet(config: RangeFacetConfig, activeFilters: FacetedSearchProps['activeFilters']): RangeFacetData {
	const filters = (activeFilters.hasOwnProperty(config.id)) ? activeFilters[config.id] as RangeFacetFilter : null

	return {
		...config,
		filters,
		max: null,
		min: null,
	}
}

function initFacet(facetConfig: FacetConfigBase, activeFilters: FacetedSearchProps['activeFilters']): FacetData {
	if		(isListFacet(facetConfig))		return initListFacet(facetConfig, activeFilters)
	else if (isBooleanFacet(facetConfig))	return initBooleanFacet(facetConfig, activeFilters)
	else if (isHierarchyFacet(facetConfig))	return initHierarchyFacet(facetConfig, activeFilters)
	else if (isRangeFacet(facetConfig))		return initRangeFacet(facetConfig, activeFilters)
	else if (isDateFacet(facetConfig))		return initDateFacet(facetConfig, activeFilters)

	return initListFacet(facetConfig as ListFacetConfig, activeFilters)
}

export function initFacetsData(fields: FacetedSearchProps['fields'], activeFilters: FacetedSearchProps['activeFilters']) {
	const initMap: FacetsData = new Map()
	return fields
		.reduce((prev, curr) => {
			const facetData = initFacet(curr, activeFilters)

			if (facetData != null) {
				if (facetData.title == null) {
					facetData.title = facetData.id.charAt(0).toUpperCase() + facetData.id.slice(1)
				}
				prev.set(curr.id, facetData)
			}

			return prev
		}, initMap)
}

export default function useFacetsDataReducer(fields: FacetedSearchProps['fields'], activeFilters: FacetedSearchProps['activeFilters']) {
	const x = React.useReducer(facetsDataReducer, null)

	React.useEffect(() => {
		x[1]({ type: 'clear', fields, activeFilters })
	}, [fields])

	return x
}

function facetsDataReducer(facetsData: FacetsData, action: FacetsDataReducerAction): FacetsData {
	if (action.type === 'clear') {
		return initFacetsData(action.fields, action.activeFilters)
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
