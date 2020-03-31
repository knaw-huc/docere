import { SearchTab, Viewport } from '../../enum'
import type { PageConfig } from '../config-data/config'
import type { Entry } from '../entry'

export interface AppState {
	entry: Entry
	entryId: string
	page: Page
	pageId: string
	searchQuery: string[]
	searchTab: SearchTab
	viewport: Viewport
}

export type Page = PageConfig & { doc: XMLDocument }

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

interface ASA_Set_Search_Tab {
	type: 'SET_SEARCH_TAB'
	tab: SearchTab
}

interface ASA_Set_Search_Query {
	type: 'SET_SEARCH_QUERY'
	query: string[]
}

interface ASA_Set_Viewport {
	type: 'SET_VIEWPORT'
	viewport: Viewport
}

export type AppStateAction = 
	ASA_Project_Changed |
	ASA_Set_Entry_Id |
	ASA_Set_Entry |
	ASA_Set_Page_Id |
	ASA_Set_Page |
	ASA_Unset_Page |
	ASA_Set_Search_Tab |
	ASA_Set_Search_Query |
	ASA_Set_Viewport
