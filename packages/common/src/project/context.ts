import React from 'react'
import { defaultEntrySettings } from '../extend-config-data'
import { AsideTab, Viewport, ContainerType } from '../enum'
import { DocereConfig, Entry, ActiveFacsimile, ID, ActiveEntity, Layers, Page } from '..'
import type { ProjectState } from './state'
import type { ProjectAction } from './action'

// Dispatch
export const DispatchContext = React.createContext<React.Dispatch<ProjectAction>>(null)

// Project
export type ProjectContextValue = Pick<ProjectState, 'config' | 'getComponents' | 'searchUrl' | 'uiComponents'>

export const initialProjectContext: ProjectContextValue = {
	config: null,
	getComponents: null,
	searchUrl: null,
	uiComponents: null,
}

export const ProjectContext = React.createContext<ProjectContextValue>(initialProjectContext)

// Page
export const PageContext = React.createContext<Page>(null)

// UI
export type UIContextValue = Pick<ProjectState, 'footerTab' | 'searchTab' | 'viewport'>

export const initialUIContext: UIContextValue = {
	footerTab: null,
	searchTab: null,
	viewport: Viewport.EntrySelector
}

export const UIContext = React.createContext(initialUIContext)

// Entry
// export type SetEntryProps = { entryId: string, facsimileId?: string, entityIds?: Set<string> }
export const initialEntryContextValue: Entry = null
export const EntryContext = React.createContext(initialEntryContextValue)

// Entry settings
export const initialEntrySettingsContextValue: DocereConfig['entrySettings'] = defaultEntrySettings
export const EntrySettingsContext = React.createContext(initialEntrySettingsContextValue)

// Entry tab
export const initialAsideTabContextValue: AsideTab = null
export const AsideTabContext = React.createContext(initialAsideTabContextValue)

// Active facsimiles
export const initialFacsimileContextValue: ActiveFacsimile = null
export const FacsimileContext = React.createContext(initialFacsimileContextValue)

// Active entities
export type ActiveEntities = Map<ID, ActiveEntity>
export const initialEntitiesContextValue: ActiveEntities = new Map()
export const EntitiesContext = React.createContext(initialEntitiesContextValue)

// Layers
export const initialLayersContextValue: Layers = new Map() //, pinLayer: null, activateLayer: null }
export const LayersContext = React.createContext(initialLayersContextValue)

// Layer
export interface ContainerContextValue {
	type: ContainerType
	id: ID
}
const initialContainerContextValue: ContainerContextValue = {
	type: null,
	id: null
}
export const ContainerContext = React.createContext(initialContainerContextValue)
