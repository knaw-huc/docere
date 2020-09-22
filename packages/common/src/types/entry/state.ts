import type { DocereConfig } from '../config-data/config'
import type { Note, FacsimileArea, Entity, ActiveFacsimile } from '../config-data/functions'
import type { Entry, EntryLookup } from '.'
import { AsideTab } from '../../enum'
import { Layer } from '../config-data/layer'

export interface EntryState {
	activeEntity: Entity,
	activeFacsimile: ActiveFacsimile
	activeFacsimileAreas: FacsimileArea[]
	activeNote: Note,
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

interface EntryChanged extends Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeNote' | 'entry' | 'layers'> {
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

interface UnsetEntity {
	type: 'UNSET_ENTITY'
}

interface SetNote {
	type: 'SET_NOTE'
	id: string
}

interface UnsetNote {
	type: 'UNSET_NOTE'
}

interface SetActiveFacsimile {
	id: string
	triggerLayer: Layer
	type: 'SET_ACTIVE_FACSIMILE'
}

interface ESA_Set_Active_Facsimile_Areas {
	type: 'SET_ACTIVE_FACSIMILE_AREAS'
	ids: string[]
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
	SetActiveFacsimile |
	SetEntity |
	UnsetEntity |
	ESA_Set_Active_Facsimile_Areas |
	SetNote |
	UnsetNote |
	ESA_Toggle_Layer | 
	ESA_Toggle_Settings_Property
