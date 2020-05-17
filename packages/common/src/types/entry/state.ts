import type { DocereConfig } from '../config-data/config'
import type { Entity, Note, Facsimile, Layer, FacsimileArea } from '../config-data/functions'
import type { Entry } from '.'
import { AsideTab } from '../../enum'

export interface EntryState {
	activeFacsimileAreas: FacsimileArea[]
	activeFacsimile: Facsimile
	activeEntity: Entity,
	activeNote: Note,
	asideTab: AsideTab
	entry: Entry
	layers: Layer[]
	settings: DocereConfig['entrySettings']
}

interface ProjectChanged {
	type: 'PROJECT_CHANGED',
	settings: DocereConfig['entrySettings'],
}

interface EntryChanged extends Pick<EntryState, 'activeFacsimile' | 'entry' | 'layers'> {
	type: "ENTRY_CHANGED",
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

interface ESA_Set_Entity_Id {
	type: 'SET_ENTITY'
	id: string
}

interface ESA_Set_Note_Id {
	type: 'SET_NOTE'
	id: string
}

interface ESA_Set_Active_Facsimile {
	type: 'SET_ACTIVE_FACSIMILE'
	id: string
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
	ESA_Set_Active_Facsimile |
	ESA_Set_Entity_Id |
	ESA_Set_Active_Facsimile_Areas |
	ESA_Set_Note_Id |
	ESA_Toggle_Layer | 
	ESA_Toggle_Settings_Property
