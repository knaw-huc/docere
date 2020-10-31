import { AsideTab } from '../../enum'

import type { ID, StatefulLayer } from '../config-data/layer'
import type { DocereConfig } from '../config-data/config'
import type { Entry } from './index'
import type { ActiveEntity, ActiveFacsimile } from '../config-data/functions'

export interface EntryState {
	activeEntities: Map<ID, ActiveEntity>
	activeFacsimiles: Map<ID, ActiveFacsimile>
	asideTab: AsideTab
	entry: Entry
	entrySettings: DocereConfig['entrySettings']
	layers: Map<ID, StatefulLayer>
	projectConfig: DocereConfig
}

interface ProjectChanged {
	type: 'PROJECT_CHANGED',
	config: DocereConfig,
}

interface EntryChanged extends Pick<EntryState, 'activeEntities' | 'activeFacsimiles' | 'entry' | 'layers'> {
	type: "ENTRY_CHANGED",
}

interface ESA_Toggle_Layer {
	type: 'TOGGLE_LAYER'
	id: ID
}

interface PinPanel {
	type: 'PIN_PANEL',
	id: ID
}

interface ToggleAsideTab {
	type: 'TOGGLE_TAB',
	tabType: 'aside'
	tab: EntryState['asideTab']
}

type ToggleTab = ToggleAsideTab

interface SetEntity {
	id: ID
	layerId: ID
	triggerLayerId: ID
	type: 'SET_ENTITY'
}

export interface SetFacsimile {
	id: ID
	layerId: ID
	triggerLayerId: ID
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
