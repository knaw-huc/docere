import { RsType } from '../../enum'
import type { FacetConfig } from '../search/facets'
import { PageConfig } from '../page'
import { ExtractedTextData, Facsimile, ExtractedNote } from './functions'
import { TextLayerConfig, FacsimileLayerConfig } from './layer'
import { ConfigEntry } from '../entry'

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
	notes?: NoteConfig[]
	pages?: PageConfig[]
	plainText?: (entry: ConfigEntry, config: DocereConfig) => string
	prepare?: (entry: ConfigEntry, config: DocereConfig) => Element
	private?: boolean
	searchResultCount?: number
	slug: string
	parts?: {
		extract: ExtractEntryPartElements
		keepSource?: boolean /* Keep the source document and store as an entry */
	},
	title?: string
}

export type ExtractEntryPartElements = (entry: ConfigEntry, config: DocereConfig) => Map<string, Element>

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
	extract: (entry: ConfigEntry, config?: DocereConfig) => string | number | string[] | number[] | boolean
}

export type ExtractTextData = (entry: ConfigEntry, config?: DocereConfig) => ExtractedTextData[]

export type EntityConfig = TmpConfig & {
	color?: string
	extract: ExtractTextData
	revealOnHover?: boolean
	type?: RsType | string
}

// TODO rename to NoteConfig
export interface NoteConfig extends BaseConfig {
	color?: string
	extract: (entry: ConfigEntry, config?: DocereConfig) => ExtractedNote[]
}
// export interface NotesConfig extends BaseConfig {

interface FacsimileConfig {
	extract: (entry: ConfigEntry, config: DocereConfig) => Facsimile[]
}
