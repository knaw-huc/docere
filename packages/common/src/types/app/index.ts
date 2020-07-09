import { SearchTab, Viewport, FooterTab } from '../../enum'
import type { Entry } from '../entry'
import { Page } from '../page'

export interface AppState {
	entry: Entry
	entryId: string
	footerTab: FooterTab
	page: Page
	pageId: string
	searchTab: SearchTab
	viewport: Viewport
}

interface ASA_Project_Changed {
	type: 'PROJECT_CHANGED'
	entryId: string
	pageId: string
}

interface ASA_Set_Entry_Id {
	type: 'SET_ENTRY_ID'
	id: string
}

interface ASA_Set_Entry {
	type: 'SET_ENTRY'
	entry: Entry
}

interface ASA_Set_Page_Id {
	type: 'SET_PAGE_ID'
	id: string
}

interface ASA_Set_Page {
	type: 'SET_PAGE'
	page: Page
}

interface ASA_Unset_Page {
	type: 'UNSET_PAGE'
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
	ASA_Set_Entry_Id |
	ASA_Set_Page |
	ASA_Set_Page_Id |
	ASA_Set_Viewport |
	ASA_Unset_Page
