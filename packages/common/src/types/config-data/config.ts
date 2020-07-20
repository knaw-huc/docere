import { RsType } from '../../enum'
import type { FacetConfig } from '../search/facets'
import { PageConfig } from '../page'
import { ExtractedNote, ExtractedTextData } from './functions'
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
	layers?: (TextLayerConfig | FacsimileLayerConfig)[]
	metadata?: MetadataConfig[]
	notes?: NotesConfig[]
	pages?: PageConfig[]
	private?: boolean
	searchResultCount?: number
	slug: string
	parts?: {
		extract: ExtractEntryPartElements
		entities?: EntityConfig[]
		layers?: (TextLayerConfig | FacsimileLayerConfig)[]
		metadata?: MetadataConfig[]
		notes?: NotesConfig[]
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

export type MetadataConfig = FacetConfig & {
	showInAside?: boolean /* Show data in the aside of the detail view? */
	showAsFacet?: boolean /* Show data as a facet? */
}

export type ExtractTextData = (entry: Entry, config?: DocereConfig) => ExtractedTextData[]

export type EntityConfig = MetadataConfig & {
	color?: string
	extract: ExtractTextData
	revealOnHover?: boolean
	textLayers?: string[]
	type?: RsType | string
}

// TODO rename to NoteConfig
export type NotesConfig = Omit<EntityConfig, 'extract'> & {
	extract: (entry: Entry, config?: DocereConfig) => ExtractedNote[]
}
// export interface NotesConfig extends BaseConfig {


