import React from 'react'
import { ListFacetFilter, RangeFacetFilter } from '@docere/common'

import { isListFacetData, isBooleanFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData, isListFacetConfig, isBooleanFacetConfig, isHierarchyFacetConfig, isRangeFacetConfig, isDateFacetConfig } from '../utils'

import type { FacetConfig, FacetedSearchContext, BooleanFacetConfig, BooleanFacetData, DateFacetConfig, DateFacetData, HierarchyFacetConfig, HierarchyFacetData, ListFacetConfig, ListFacetData, RangeFacetConfig, RangeFacetData, FacetData, FacetsData, FacetsDataReducerAction } from '@docere/common'

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

function initFacet(facetConfig: FacetConfig, activeFilters: FacetedSearchContext['activeFilters']): FacetData {
	if		(isListFacetConfig(facetConfig))		return initListFacet(facetConfig, activeFilters)
	else if (isBooleanFacetConfig(facetConfig))		return initBooleanFacet(facetConfig, activeFilters)
	else if (isHierarchyFacetConfig(facetConfig))	return initHierarchyFacet(facetConfig, activeFilters)
	else if (isRangeFacetConfig(facetConfig))		return initRangeFacet(facetConfig, activeFilters)
	else if (isDateFacetConfig(facetConfig))		return initDateFacet(facetConfig, activeFilters)
}

export function initFacetsData(fields: FacetedSearchContext['facetsConfig'], activeFilters: FacetedSearchContext['activeFilters']) {
	const initMap: FacetsData = new Map()
	return Object.keys(fields)
		.reduce((prev, field) => {
			const facetData = initFacet(fields[field], activeFilters)
			prev.set(facetData.config.id, facetData)
			return prev
		}, initMap)
}

export default function useFacetsDataReducer(fields: FacetedSearchContext['facetsConfig'], activeFilters: FacetedSearchContext['activeFilters']) {
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

	if (isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'remove_filter': {
				const filters = Array.from(facet.filters)
				const nextFilters = filters.slice(0, filters.indexOf(action.value))
				facet.filters = new Set(nextFilters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacetData(facet) || isBooleanFacetData(facet)) {
		switch(action.type) {
			case 'remove_filter': {
				facet.filters.delete(action.value)
				facet.filters = new Set(facet.filters)
				return new Map(facetsData)
			}
		}
	}

	if (isListFacetData(facet) || isBooleanFacetData(facet) || isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'add_filter': {
				facet.filters = new Set(facet.filters.add(action.value))
				return new Map(facetsData)
			}
		}
	}

	if (isRangeFacetData(facet) || isDateFacetData(facet)) {
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

	if (isListFacetData(facet)) {
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

	if (isListFacetData(facet) || isHierarchyFacetData(facet)) {
		switch(action.type) {
			case 'view_less': {
				if (facet.size > facet.config.size) {
					facet.size -= facet.config.size
					if (facet.size < facet.config.size) facet.size = facet.config.size
					return new Map(facetsData)
				}
				break
			}

			case 'view_more': {
				if (action.total - facet.size > 0) {
					facet.size += facet.config.size
					return new Map(facetsData)
				}
				break
			}
		}
	}

	return facetsData
}
