import { EntityType, Colors, EsDataType } from '../enum'
import type { FacetConfig } from '../types/search/facets'
import { PageConfig } from '../page'
import { PartialExportOptions, PartialStandoff, PartialStandoffAnnotation, StandoffAnnotation, StandoffTree, StandoffWrapper } from '../standoff-annotations'
import { FacsimileLayerConfig, ID, TextLayerConfig } from '../entry'

export * from './extend'

// TODO rename to ProjectConfig
// TODO rename slug to id
// TODO move entities, layers, notes, split, metadata, etc under 'entry' and create EntryConfig interface
/**
 * Project configuration
 * 
 * @interface
 */
export interface DocereConfig {
	collection?: { metadataId: string, sortBy: string } /* true if whole project is one collection, MetadataConfig.id if project consists of multiple collections */
	data?: Record<string, any>

	/** Options for the project documents */
	documents?: {
		/** 
		 * Paths to project document dirs on the remote server
		 * 
		 * @default [<project ID>]
		 */
		remoteDirectories?: string[]

		/**
		 * By default the root directory to a document (not the sub directories!)
		 * is removed from the ID. To disable this default behavior set this
		 * option to false.
		 * 
		 * @default true
		 * @example if remote directory is a/b and the file is in a/b/c/d/e.xml, the ID will be c/d/e.xml
		 */
		stripRemoteDirectoryFromDocumentId?: boolean

		/**
		 * Type of documents. XML documents are converted to standoff
		 * 
		 * @default standoff
		 */
		type?: 'standoff' | 'xml'
	}

	// entities?: EntityConfig[]
	entrySettings?: EntrySettings

	// createFacsimiles?: (props: CreateEntryProps) => ExtractedFacsimile[]

	// TODO entities also have filter and getId, share?
	facsimiles?: {
		filter: (annotation: PartialStandoffAnnotation) => boolean
		getId?: (annotation: PartialStandoffAnnotation) => string
		getPath: (annotation: PartialStandoffAnnotation) => string
	}

	layers2?: (TextLayerConfig | FacsimileLayerConfig)[]
	entities2?: EntityConfig2[]
	metadata2?: MetadataConfig[]

	/**
	 * Configure the background pages of the project, for example:
	 * about, colofon, manual, structured data (people, places, ...)
	 */
	pages?: {
		/**
		 * Page configs. The hierarchy of the configuration
		 * is used to display the pages in a menu reflecting given
		 * hierarchy
		 */
		config: PageConfig[]

		/**
		 * Get the remote path of the pages.
		 * 
		 * Order of precedence to get the remote path:
		 * 1. PageConfig['remotePath']
		 * 2. getRemotePath
		 * 3. ${PageConfig['id']}.xml
		 */
		getRemotePath?: (config: PageConfig) => string
	}
	standoff?: {
		exportOptions?: PartialExportOptions

		/**
		 * Function to convert any input to {@link PartialStandoff}
		 */
		prepareSource?: (source: any) => PartialStandoff

		/**
		 * Function to prepare the annotations using the thin wrapper of
		 * {@link StandoffWrapper}. The class allows alteration of the annotations
		 * before it is added to the {@link StandoffTree}. Using a StandoffWrapper
		 * is faster than using a StandoffTree, with almost the same functionality.
		 * If the StandoffTree is needed, use {@link DocereConfig.standoff.prepareExport}
		 */
		prepareAnnotations?: (standoffWrapper: StandoffWrapper<PartialStandoffAnnotation>) => void

		/**
		 * Function to prepare the export of the {@link StandoffTree}. Most changes
		 * to the {@link StandoffAnnotation}s should be done using the {@link DocereConfig.standoff.prepareAnnotations}
		 * function, but some need the tree, for example when finding annotations
		 * {@link StandoffTree.findBefore | before} and {@link StandoffTree.findAfter | after}.
		 */
		prepareExport?: (standoffTree: StandoffTree) => void
	}
	private?: boolean
	searchResultCount?: number
	slug: ID
	title?: string
}

export interface EntrySettings {
	'panels.showHeaders'?: boolean

	'panels.text.openPopupAsTooltip'?: boolean
	'panels.text.showMinimap'?: boolean
	'panels.text.showLineBeginnings'?: boolean
	'panels.text.showPageBeginnings'?: boolean
	'panels.text.showNotes'?: boolean,

	// Automatically remove current active entities when activating a new entity.
	// When set to false, the previous active entities stay active and highlighted.
	'panels.entities.toggle'?: boolean,

	// Show/hide entities
	'panels.entities.show'?: boolean,
}

export interface BaseConfig {
	id: ID
	title?: string
}

type TmpConfig = FacetConfig & {
	showInAside?: boolean /* Show data in the aside of the detail view? */
	showAsFacet?: boolean /* Show data as a facet? */
}

// export type ExtractMetadata = (entry: ExtractedEntry, config?: DocereConfig) => string | number | string[] | number[] | boolean
export type MetadataConfig = TmpConfig

// export type ExtractTextData = (entry: ConfigEntry, config?: DocereConfig) => ExtractedTextData[]

// export type EntityConfig = TmpConfig & {
// 	color?: string
// 	extract: ExtractTextData
// }
	// extractEntities?: (layer: SerializedTextLayer, entry: ConfigEntry, config: DocereConfig) => ExtractedEntity[]

// export interface ExtractEntitiesProps {
// 	config: DocereConfig
// 	entityConfig: EntityConfig
// 	entry: ExtractedEntry
// 	layer: TextLayerConfig
// 	layerElement: Element
// }
// export type ExtractEntities = (props: ExtractEntitiesProps) => ExtractedEntity[]
// type ExtractEntityId = (el: Element) => string

// export type EntityConfig = TmpConfig & {
// 	// extractId: ExtractEntityId
// 	// extract: ExtractEntities
// 	// selector: string
// }

export type EntityConfig2 = TmpConfig & {
	color?: string
	revealOnHover?: boolean
	type?: EntityType | string

	filter: (annotation: PartialStandoffAnnotation) => boolean

	/**
	 * Set the ID of the entity. Not te be confused with the annotation ID!
	 * An entity can consist of multiple annotations. Defaults to a.metadata._id
	 */
	getId?: (a: PartialStandoffAnnotation) => string

	/**
	 * Set the value of the entity. This is primarily used to show in 
	 * the faceted search and in the metadata tab
	 */ 
	getValue?: (a: PartialStandoffAnnotation) => string
}

export const defaultMetadata: Required<MetadataConfig> = {
	datatype: EsDataType.Keyword,
	id: null,
	// TODO fixate the order number, which means: if there is no order than increment the order number: 999, 1000, 1001, 1002 (import for example the sort setting in the FS)
	order: 9999,
	showAsFacet: true,
	showInAside: true,

	// Add defaults, because they are Required<>
	size: null,
	sort: null,
	description: null,
	title: null,
}

export const defaultEntityConfig: Required<EntityConfig2> = {
	...defaultMetadata,
	color: Colors.Blue,
	description: null,
	filter: null,
	getId: (a: StandoffAnnotation) => a.id,
	getValue: (_a: StandoffAnnotation) => null,
	revealOnHover: false,
	type: EntityType.None,
}


// export interface NotesConfig extends BaseConfig {

// interface FacsimileConfig {
	// extract: (entry: ConfigEntry, config: DocereConfig) => ExtractedFacsimile[]
// }
