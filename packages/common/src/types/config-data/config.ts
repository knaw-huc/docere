import { RsType } from '../../enum'
import type { FacetConfig } from '../search/facets'
import { PageConfig } from '../page'
import { ExtractedNote, ExtractedTextData, Facsimile } from './functions'
import { TextLayerConfig, FacsimileLayerConfig } from './layer'
import { Entry } from '../entry'

// TODO rename to ProjectConfig
// TODO rename slug to id
// TODO move entities, layers, notes, split, metadata, etc under 'entry' and create EntryConfig interface
export interface DocereConfig {
	collection?: { metadataId: string, sortBy: string } /* true if whole project is one collection, MetadataConfig.id if project consists of multiple collections */
	data?: Record<string, any>
	entities?: EntityConfig[]
	entrySettings?: EntrySettings
	facsimiles?: FacsimileConfig
	layers?: (TextLayerConfig | FacsimileLayerConfig)[]
	metadata?: MetadataConfig[]
	notes?: NotesConfig[]
	pages?: PageConfig[]
	plainText?: (entry: Entry, config: DocereConfig) => string
	prepare?: (entry: Entry, config: DocereConfig) => Element
	private?: boolean
	searchResultCount?: number
	slug: string
	parts?: {
		extract: ExtractEntryPartElements
		keepSource?: boolean /* Keep the source document and store as an entry */
	},
	title: string
}

export type ExtractEntryPartElements = (entry: Entry, config: DocereConfig) => Map<string, Element>

interface EntrySettings {
	'panels.showHeaders'?: boolean
	'panels.text.openPopupAsTooltip'?: boolean
	'panels.text.showMinimap'?: boolean
	'panels.text.showLineBeginnings'?: boolean
	'panels.text.showPageBeginnings'?: boolean
	'panels.text.showEntities'?: boolean,
	'panels.text.showNotes'?: boolean,
}

export interface BaseConfig {
	id: string
	title?: string
}

type TmpConfig = FacetConfig & {
	showInAside?: boolean /* Show data in the aside of the detail view? */
	showAsFacet?: boolean /* Show data as a facet? */
}

export type MetadataConfig = TmpConfig & {
	extract: (entry: Entry, config?: DocereConfig) => string | number | string[] | number[] | boolean
}

export type ExtractTextData = (entry: Entry, config?: DocereConfig) => ExtractedTextData[]

export type EntityConfig = TmpConfig & {
	color?: string
	extract: ExtractTextData
	revealOnHover?: boolean
	// TODO remove textLayers prop, entities are attached to layers
	textLayers?: string[]
	type?: RsType | string
}

// TODO rename to NoteConfig
export type NotesConfig = Omit<EntityConfig, 'extract'> & {
	extract: (entry: Entry, config?: DocereConfig) => ExtractedNote[]
}
// export interface NotesConfig extends BaseConfig {

interface FacsimileConfig {
	extract: (entry: Entry, config: DocereConfig) => Facsimile[]
}
