import type { DocereConfig } from '../config-data/config'
import type { Entity, Note, Facsimile, Layer, FacsimileArea } from '../config-data/functions'
import type { Entry } from '.'
import { AsideTab, FooterTab } from '../../enum'

export interface EntryState {
	activeFacsimileAreas: FacsimileArea[]
	activeFacsimile: Facsimile
	activeEntity: Entity,
	activeNote: Note,
	asideTab: AsideTab
	entry: Entry
	footerTab: FooterTab
	layers: Layer[]
	settings: DocereConfig['entrySettings']
}

interface ESA_Entry_Changed extends Pick<EntryState, 'activeFacsimile' | 'entry' | 'layers' | 'settings'> {
	type: "ENTRY_CHANGED",
}

interface ESA_Toggle_Layer {
	type: 'TOGGLE_LAYER'
	id: string
}

interface ESA_Toggle_Aside_Tab extends Pick<EntryState, 'asideTab'> {
	type: 'TOGGLE_ASIDE_TAB'
}

interface ESA_Toggle_Footer_Tab extends Pick<EntryState, 'footerTab'> {
	type: 'TOGGLE_FOOTER_TAB'
}

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
	ESA_Entry_Changed |
	ESA_Set_Active_Facsimile |
	ESA_Set_Entity_Id |
	ESA_Set_Active_Facsimile_Areas |
	ESA_Set_Note_Id |
	ESA_Toggle_Aside_Tab |
	ESA_Toggle_Footer_Tab |
	ESA_Toggle_Layer | 
	ESA_Toggle_Settings_Property
