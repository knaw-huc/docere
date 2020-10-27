import type { DocereConfig } from '../config-data/config'
import type { Entity, ActiveFacsimile } from '../config-data/functions'
import type { Entry, EntryLookup } from '.'
import { AsideTab } from '../../enum'
import { Layer } from '../config-data/layer'

export type ActiveEntities = Map<string, Entity>
export type ActiveFacsimiles = Map<string, ActiveFacsimile>
export interface EntryState {
	activeEntities: ActiveEntities
	asideTab: AsideTab
	projectConfig: DocereConfig
	entry: Entry
	entrySettings: DocereConfig['entrySettings']
	layers: Layer[]
	lookup: EntryLookup
}

interface ProjectChanged {
	type: 'PROJECT_CHANGED',
	config: DocereConfig,
}

interface EntryChanged extends Pick<EntryState, 'activeEntities' | 'entry' | 'layers'> {
	type: "ENTRY_CHANGED",
	lookup: EntryState['lookup']
}

interface ESA_Toggle_Layer {
	type: 'TOGGLE_LAYER'
	id: string
}

interface PinPanel {
	type: 'PIN_PANEL',
	id: string
}

interface ToggleAsideTab {
	type: 'TOGGLE_TAB',
	tabType: 'aside'
	tab: EntryState['asideTab']
}

type ToggleTab = ToggleAsideTab

interface SetEntity {
	type: 'SET_ENTITY'
	id: string
}

export interface SetFacsimile {
	id: string
	triggerLayer: Layer
	type: 'SET_FACSIMILE'
}

interface ESA_Toggle_Settings_Property {
	type: 'TOGGLE_SETTINGS_PROPERTY',
	property: keyof DocereConfig['entrySettings'],
}

export type EntryStateAction = 
	PinPanel |
	ProjectChanged |
	EntryChanged |
	ToggleTab |
	SetFacsimile |
	SetEntity |
	ESA_Toggle_Layer | 
	ESA_Toggle_Settings_Property
