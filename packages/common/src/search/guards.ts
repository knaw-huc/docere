import { EsDataType } from '..'
import type { FacetData, BooleanFacetData, DateFacetData, HierarchyFacetData, ListFacetData, RangeFacetData, FacetConfig, BooleanFacetConfig, DateFacetConfig, HierarchyFacetConfig, ListFacetConfig, RangeFacetConfig } from '..'
import type { BaseMetadataConfig, BooleanMetadata, BooleanMetadataConfig, DateMetadata, DateMetadataConfig, HierarchyMetadata, HierarchyMetadataConfig, ListMetadata, ListMetadataConfig, MetadataItem, RangeMetadata, RangeMetadataConfig } from '../entry'

export function isBooleanMetadataItem(metadataItem: MetadataItem): metadataItem is BooleanMetadata {
	return isBooleanMetadataConfig(metadataItem.config)
}

export function isDateMetadataItem(metadataItem: MetadataItem): metadataItem is DateMetadata {
	return isDateMetadataConfig(metadataItem.config)
}

export function isHierarchyMetadataItem(metadataItem: MetadataItem): metadataItem is HierarchyMetadata {
	return isHierarchyMetadataConfig(metadataItem.config)
}

export function isListMetadataItem(metadataItem: MetadataItem): metadataItem is ListMetadata {
	return isListMetadataConfig(metadataItem.config)
}

export function isRangeMetadataItem(metadataItem: MetadataItem): metadataItem is RangeMetadata {
	return isRangeMetadataConfig(metadataItem.config)
}

// NEW
export function isBooleanMetadataConfig(config: BaseMetadataConfig): config is BooleanMetadataConfig {
	return config.facet?.datatype === EsDataType.Boolean
}

export function isDateMetadataConfig(config: BaseMetadataConfig): config is DateMetadataConfig {
	return config.facet?.datatype === EsDataType.Date
}

export function isHierarchyMetadataConfig(config: BaseMetadataConfig): config is HierarchyMetadataConfig {
	return config.facet?.datatype === EsDataType.Hierarchy
}

export function isListMetadataConfig(config: BaseMetadataConfig): config is ListMetadataConfig {
	if (config.facet == null) return false
	return config.facet.datatype === EsDataType.Keyword || config.facet.datatype == null
}

export function isRangeMetadataConfig(config: BaseMetadataConfig): config is RangeMetadataConfig {
	return config.facet?.datatype === EsDataType.Integer
}
// \NEW

export function isBooleanFacetData(facetData: FacetData): facetData is BooleanFacetData {
	return isBooleanMetadataConfig(facetData.config)
}

export function isDateFacetData(facetData: FacetData): facetData is DateFacetData {
	return isDateMetadataConfig(facetData.config)
}

export function isHierarchyFacetData(facetData: FacetData): facetData is HierarchyFacetData {
	return isHierarchyMetadataConfig(facetData.config)
}

export function isListFacetData(facetData: FacetData): facetData is ListFacetData {
	return isListMetadataConfig(facetData.config)
}

export function isRangeFacetData(facetData: FacetData): facetData is RangeFacetData {
	return isRangeMetadataConfig(facetData.config)
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

