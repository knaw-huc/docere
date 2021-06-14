import { EsDataType } from '../../enum'
import { FilterFunction, PartialStandoffAnnotation } from '../../standoff-annotations'
import { BooleanFacetConfig, DateFacetConfig, FacetConfig, HierarchyFacetConfig, ListFacetConfig, RangeFacetConfig } from '../../types/search/facets'
// import { PartialStandoffAnnotation } from '../../standoff-annotations'
// import { FacetConfig } from '../../types/search/facets'
import { CreateJsonEntryProps } from '../create-json'
// import { Entity } from '../entity'
import { ID } from '../layer'

export * from './string'

export type MetadataValue = string | string[] | number | number[] | boolean

export interface BaseConfig {
	/**
	 * Thou shalt have an ID
	 */
	id: ID

	/**
	 * Title of the metadata or entity. When left blank, the title is constructed
	 * from the ID by {@link setTitle}.
	 */
	title?: string
}

export interface BaseMetadataConfig extends BaseConfig {
	/**
	 * Configuration for the search facet. If there is no config,
	 * no facet will be generated.
	 */
	facet?: FacetConfig 

	/**
	 * Show metadata or entity in the aside of the detail view.
	 */ 
	showInAside?: boolean 
}

export interface DefaultMetadataConfig extends BaseMetadataConfig {
	/**
	 * Get the value of the metadata item.
	 * 
	 * Defaults to the property with
	 * {@link BaseConfig.id} as name on the metadata of the root of the tree
	 */
 	getValue?: (config: DefaultMetadataConfig, props: CreateJsonEntryProps) => MetadataValue
}

/**
 * A special kind of metadata which has a link to an {@link Entity}.
 * 
 * For example when a person has a special function which should be mentioned in the
 * metadata, like chairman, sender, receiver, etc. Another example is the date of the
 * document which is mentioned in the document. In the metadata aside 
 */
export interface EntityMetadataConfig extends BaseMetadataConfig {
	entityConfigId: ID
	filterEntities: FilterFunction<PartialStandoffAnnotation>
}

export function isEntityMetadataConfig(config: MetadataConfig): config is EntityMetadataConfig {
	return config.hasOwnProperty('entityConfigId')
}

export type MetadataConfig = DefaultMetadataConfig | EntityMetadataConfig

export const defaultFacetConfig: FacetConfig = {
	datatype: EsDataType.Keyword,
	description: null,
	order: 9999, // TODO fixate the order number, which means: if there is no order than increment the order number: 999, 1000, 1001, 1002 (import for example the sort setting in the FS)
	size: null,
	sort: null,
}

export const defaultMetadata: Required<DefaultMetadataConfig> = {
	facet: null,
	getValue: (config, props) => props.tree.annotations[0]?.metadata[config.id],
	id: null,
	showInAside: true,
	title: null,
}

export interface RangeMetadataConfig extends BaseMetadataConfig {
	facet: RangeFacetConfig
}
export interface ListMetadataConfig extends BaseMetadataConfig {
	facet: ListFacetConfig
}
export interface HierarchyMetadataConfig extends BaseMetadataConfig {
	facet: HierarchyFacetConfig
}
export interface DateMetadataConfig extends BaseMetadataConfig {
	facet: DateFacetConfig
}
export interface BooleanMetadataConfig extends BaseMetadataConfig {
	facet: BooleanFacetConfig
}
