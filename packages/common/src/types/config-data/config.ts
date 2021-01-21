import { EntityType, Colors, EsDataType } from '../../enum'
import type { FacetConfig } from '../search/facets'
import { PageConfig } from '../../page'
import { FacsimileLayerConfig, TextLayerConfig, ExtractedEntry, ID, ExtractedEntity, ExtractedFacsimile } from '../..'

interface ExtractFacsimilesProps {
	config: DocereConfig
	entry: ExtractedEntry
	layer: TextLayerConfig
	layerElement: Element
}
export type ExtractFacsimiles = (props: ExtractFacsimilesProps) => ExtractedFacsimile[]

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
	}

	entities?: EntityConfig[]
	entrySettings?: EntrySettings
	facsimiles?: {
		extractFacsimileId: (el: Element) => string
		extractFacsimiles: ExtractFacsimiles
		selector: string
	}
	layers?: (TextLayerConfig | FacsimileLayerConfig)[]
	metadata?: MetadataConfig[]
	pages?: PageConfig[]
	plainText?: (entry: ExtractedEntry, config: DocereConfig) => string
	prepare?: (entry: ExtractedEntry, config: DocereConfig) => Element
	private?: boolean
	searchResultCount?: number
	slug: ID
	parts?: {
		extract: ExtractEntryPartElements
		keepSource?: boolean /* Keep the source document and store as an entry */
	},
	title?: string
}

export type ExtractEntryPartElements = (entry: ExtractedEntry, config: DocereConfig) => Map<string, Element>

export interface EntrySettings {
	'panels.showHeaders'?: boolean
	'panels.text.openPopupAsTooltip'?: boolean
	'panels.text.showMinimap'?: boolean
	'panels.text.showLineBeginnings'?: boolean
	'panels.text.showPageBeginnings'?: boolean
	'panels.text.showEntities'?: boolean,
	'panels.text.showNotes'?: boolean,
}

export interface BaseConfig {
	id: ID
	title?: string
}

type TmpConfig = FacetConfig & {
	showInAside?: boolean /* Show data in the aside of the detail view? */
	showAsFacet?: boolean /* Show data as a facet? */
}

export type MetadataConfig = TmpConfig & {
	extract: (entry: ExtractedEntry, config?: DocereConfig) => string | number | string[] | number[] | boolean
}

// export type ExtractTextData = (entry: ConfigEntry, config?: DocereConfig) => ExtractedTextData[]

// export type EntityConfig = TmpConfig & {
// 	color?: string
// 	extract: ExtractTextData
// }
	// extractEntities?: (layer: SerializedTextLayer, entry: ConfigEntry, config: DocereConfig) => ExtractedEntity[]

export interface ExtractEntitiesProps {
	config: DocereConfig
	entityConfig: EntityConfig
	entry: ExtractedEntry
	layer: TextLayerConfig
	layerElement: Element
}
export type ExtractEntities = (props: ExtractEntitiesProps) => ExtractedEntity[]
type ExtractEntityId = (el: Element) => string

export type EntityConfig = TmpConfig & {
	color?: string
	extractId: ExtractEntityId
	extract: ExtractEntities
	revealOnHover?: boolean
	selector: string
	type?: EntityType | string
}

export const defaultMetadata: Required<MetadataConfig> = {
	datatype: EsDataType.Keyword,
	extract: () => null,
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

export const defaultEntityConfig: Required<Omit<EntityConfig, 'extract' | 'extractId'>> = {
	...defaultMetadata,
	color: Colors.Blue,
	description: null,
	revealOnHover: false,
	selector: null,
	type: EntityType.None,
}


// export interface NotesConfig extends BaseConfig {

// interface FacsimileConfig {
	// extract: (entry: ConfigEntry, config: DocereConfig) => ExtractedFacsimile[]
// }
