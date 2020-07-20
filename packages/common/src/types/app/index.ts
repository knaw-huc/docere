import { SearchTab, Viewport, FooterTab } from '../../enum'
import type { Entry } from '../entry'

export interface AppState {
	entry: Entry
	footerTab: FooterTab
	searchTab: SearchTab
	viewport: Viewport
}

interface ASA_Project_Changed {
	type: 'PROJECT_CHANGED'
	entryId: string
	pageId: string
}

interface ASA_Set_Entry {
	type: 'SET_ENTRY'
	entry: Entry
}

interface ToggleFooterTab {
	type: 'TOGGLE_TAB',
	tabType: 'footer'
	tab: AppState['footerTab']
}

interface ToggleSearchTab {
	type: 'TOGGLE_TAB',
	tabType: 'search'
	tab: AppState['searchTab']
}

type ToggleTab = ToggleFooterTab | ToggleSearchTab

interface ASA_Set_Viewport {
	type: 'SET_VIEWPORT'
	viewport: Viewport
}

export type AppStateAction = 
	ToggleTab |
	ASA_Project_Changed |
	ASA_Set_Entry |
	ASA_Set_Viewport
