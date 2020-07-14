import { LayerType, RsType } from '../../enum'
import type { FacetConfig } from '../search/facets'
import { PageConfig } from '../page'

export interface DocereConfig {
	collection?: { metadataId: string, sortBy: string } /* true if whole project is one collection, MetadataConfig.id if project consists of multiple collections */
	data?: Record<string, any>
	entities?: EntityConfig[]
	entrySettings?: EntrySettings
	layers?: LayerConfig[]
	metadata?: MetadataConfig[]
	notes?: NotesConfig[]
	pages?: PageConfig[]
	private?: boolean
	searchResultCount?: number
	slug: string
	title: string
}

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

export type EntityConfig = MetadataConfig & {
	color?: string
	revealOnHover?: boolean
	textLayers?: string[]
	type?: RsType | string
}

export type NotesConfig = EntityConfig
// export interface NotesConfig extends BaseConfig {

// }

export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type?: LayerType
}

export interface TextLayerConfig extends LayerConfig {
	type: LayerType.Text
}
