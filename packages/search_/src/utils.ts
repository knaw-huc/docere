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

export function getHierarchyField(facetId: string, number = 0) {
	return `${facetId}_level${number}`
}

export function getHierarchyChildField(parentField: string) {
	const [facetId, splitter /* _level */, number] = parentField.split(/(_level)(\d+)$/)
	const childNumber = parseInt(number, 10) + 1
	return `${facetId}${splitter}${childNumber}`
}
