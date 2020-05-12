import { LayerType, TextDataExtractionType, RsType } from '../../enum'
import type { FacetConfig } from '../search/facets'

export interface DocereConfig {
	data?: Record<string, any>
	metadata?: MetadataConfig[]
	notes?: NotesConfig[]
	pages?: PageConfig[]
	searchResultCount?: number
	entrySettings?: EntrySettings
	slug: string
	entities?: EntityConfig[]
	layers?: LayerConfig[]
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

interface EntityAttributeIdentifier {
	type: TextDataExtractionType.Attribute
	attribute: string
}

interface EntityMilestoneIdentifier {
	type: TextDataExtractionType.Milestone
	idAttribute: string // <start id="some-id" />
	refAttribute: string // <end ref="some-id" />
}

interface EntityContentIdentifier {
	type: TextDataExtractionType.TextContent
}

type EntityIdentifier = EntityAttributeIdentifier | EntityMilestoneIdentifier | EntityContentIdentifier

export type EntityConfig = MetadataConfig & {
	color?: string
	identifier?: EntityIdentifier
	textLayers?: string[]
	type?: RsType | string
}

export interface PageConfig extends BaseConfig {
	path?: string
	children?: PageConfig[]
}

export interface LayerConfig extends BaseConfig {
	active?: boolean
	pinned?: boolean
	type?: LayerType
}

export interface TextLayerConfig extends LayerConfig {
	type: LayerType.Text
}

export interface NotesConfig extends BaseConfig {

}
