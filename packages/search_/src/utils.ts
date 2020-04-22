import { EsDataType } from '@docere/common'

import type { FacetData, FacetConfig, BooleanFacetConfig, DateFacetConfig, HierarchyFacetConfig, ListFacetConfig, RangeFacetConfig, BooleanFacetData, DateFacetData, HierarchyFacetData, ListFacetData, RangeFacetData } from '@docere/common'

export function isBooleanFacetData(facetData: FacetData): facetData is BooleanFacetData {
	return isBooleanFacetConfig(facetData.config)
}

export function isDateFacetData(facetData: FacetData): facetData is DateFacetData {
	return isDateFacetConfig(facetData.config)
}

export function isHierarchyFacetData(facetData: FacetData): facetData is HierarchyFacetData {
	return isHierarchyFacetConfig(facetData.config)
}

export function isListFacetData(facetData: FacetData): facetData is ListFacetData {
	return isListFacetConfig(facetData.config)
}

export function isRangeFacetData(facetData: FacetData): facetData is RangeFacetData {
	return isRangeFacetConfig(facetData.config)
}

export function isBooleanFacetConfig(facetConfig: FacetConfig): facetConfig is BooleanFacetConfig {
	return facetConfig.datatype === EsDataType.Boolean
}

export function isDateFacetConfig(facetConfig: FacetConfig): facetConfig is DateFacetConfig {
	return facetConfig.datatype === EsDataType.Date
}

export function isHierarchyFacetConfig(facetConfig: FacetConfig): facetConfig is HierarchyFacetConfig {
	return facetConfig.datatype === EsDataType.Hierarchy
}

export function isListFacetConfig(facetConfig: FacetConfig): facetConfig is ListFacetConfig {
	return facetConfig.datatype === EsDataType.Keyword || facetConfig.datatype == null
}

export function isRangeFacetConfig(facetConfig: FacetConfig): facetConfig is RangeFacetConfig {
	return facetConfig.datatype === EsDataType.Integer
}

export function getChildFieldName(parentFieldName: string, number?: number) {
	const [field, extractedNumber] = parentFieldName.split('_level')
	number = number != null ? number : parseInt(extractedNumber, 10) + 1
	return `${field}_level${number}`
}
