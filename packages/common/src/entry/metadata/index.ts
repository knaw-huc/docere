import { EsDataType } from '../../enum'
import { FilterFunction, PartialStandoffAnnotation } from '../../standoff-annotations'
// import { PartialStandoffAnnotation } from '../../standoff-annotations'
import { FacetConfig } from '../../types/search/facets'
import { CreateEntryProps } from '../create-json'
// import { Entity } from '../entity'
import { ID } from '../layer'

export * from './string'

export interface BaseConfig {
	id: ID
	title?: string
}

type DefaultMetadataConfig = FacetConfig & {
	showInAside?: boolean /* Show data in the aside of the detail view? */
	showAsFacet?: boolean /* Show data as a facet? */
 	getValue?: (config: MetadataConfig, props: CreateEntryProps) => string | string[] | number | number[] | boolean
	entityConfigId?: ID
	filterEntities?: FilterFunction<PartialStandoffAnnotation>
}

// export type EntityMetadataConfig = Omit<DefaultMetadataConfig, 'getValue'> & {
// 	entityConfigId: ID
// 	filterEntities: FilterFunction<PartialStandoffAnnotation>
// }

// export function isEntityMetadataConfig<T>(config: FacetConfig): config is EntityMetadataConfig {
// 	return config.hasOwnProperty('entityConfigId') && config.hasOwnProperty('filterEntities')
// }

export type MetadataConfig = DefaultMetadataConfig //| EntityMetadataConfig

export const defaultMetadata: Required<MetadataConfig> = {
	datatype: EsDataType.Keyword,
	description: null,
	getValue: (config, props) => props.tree.annotations[0]?.metadata[config.id],
	entityConfigId: null,
	filterEntities: null,
	id: null,
	order: 9999, // TODO fixate the order number, which means: if there is no order than increment the order number: 999, 1000, 1001, 1002 (import for example the sort setting in the FS)
	showAsFacet: true,
	showInAside: true,
	size: null,
	sort: null,
	title: null,
}
