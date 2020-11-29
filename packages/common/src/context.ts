import React from 'react'
import { defaultEntrySettings } from './extend-config-data'
import { AsideTab } from './enum'
import { DocereConfig, GetComponents, GetUIComponent, Entry, ActiveFacsimile, ID, ActiveEntity, StatefulLayer } from '.'

// Project
// TODO rename to ProjectContextValue
export interface ProjectContext {
	config: DocereConfig
	getComponents: GetComponents
	getUIComponent: GetUIComponent
	searchUrl: string
}
export const initialProjectContext: ProjectContext = null
export const ProjectContext = React.createContext<ProjectContext>(initialProjectContext)

// Entry
export type SetEntryProps = { entryId: string, facsimileId?: string, entityIds?: Set<string> }
interface EntryContextValue {
	entry: Entry
	initialFacsimileId: string
	initialEntityIds: Set<string>
	setEntry: (props: SetEntryProps) => void
}
const initialEntryContextValue: EntryContextValue = {
	entry: null,
	initialFacsimileId: null,
	initialEntityIds: null,
	setEntry: null,
}
export const EntryContext = React.createContext(initialEntryContextValue)

// Entry settings
export interface EntrySettingsContextValue {
	settings: DocereConfig['entrySettings']
	toggleSetting: (prop: keyof DocereConfig['entrySettings']) => void
}
export const initialEntrySettingsContextValue: EntrySettingsContextValue = { settings: defaultEntrySettings, toggleSetting: null }
export const EntrySettingsContext = React.createContext(initialEntrySettingsContextValue)

// Entry tab
interface EntryTabContextValue {
	asideTab: AsideTab
	setAsideTab: React.Dispatch<React.SetStateAction<AsideTab>>
}
const initialEntryTabContextValue: EntryTabContextValue = { asideTab: null, setAsideTab: null }
export const EntryTabContext = React.createContext(initialEntryTabContextValue)

// Active facsimiles
interface FacsimileContextValue {
	activeFacsimile: ActiveFacsimile
	setActiveFacsimile: (id: ID, triggerLayerId: ID, layerId: ID) => void
}
const initialFacsimileContextValue: FacsimileContextValue = { activeFacsimile: null, setActiveFacsimile: null }
export const FacsimileContext = React.createContext(initialFacsimileContextValue)

// Active entities
export interface EntitiesContextValue {
	activeEntities: Map<ID, ActiveEntity>
	addActiveEntity: (id: ID, triggerLayerId: ID, layerId: ID) => void
}
const initialEntitiesContextValue: EntitiesContextValue = { activeEntities: new Map(), addActiveEntity: null }
export const EntitiesContext = React.createContext(initialEntitiesContextValue)

// Layers
export interface LayersContextValue {
	activateLayer: (layerId: string) => void
	layers: Map<ID, StatefulLayer>
	pinLayer: (layerId: string) => void
}
const initialLayersContextValue: LayersContextValue = { layers: new Map(), pinLayer: null, activateLayer: null }
export const LayersContext = React.createContext(initialLayersContextValue)

// Layer
const initialLayerContextValue: StatefulLayer = null
export const LayerContext = React.createContext(initialLayerContextValue)
