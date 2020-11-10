import { SearchTab, Viewport, FooterTab } from '../../enum'

export interface ProjectUIState {
	footerTab: FooterTab
	searchTab: SearchTab
	viewport: Viewport
}

interface ASA_Project_Changed {
	type: 'PROJECT_CHANGED'
	entryId: string
	pageId: string
}

interface ToggleFooterTab {
	type: 'TOGGLE_TAB',
	tabType: 'footer'
	tab: ProjectUIState['footerTab']
}

interface ToggleSearchTab {
	type: 'TOGGLE_TAB',
	tabType: 'search'
	tab: ProjectUIState['searchTab']
}

type ToggleTab = ToggleFooterTab | ToggleSearchTab

interface ASA_Set_Viewport {
	type: 'SET_VIEWPORT'
	viewport: Viewport
}

export type ProjectUIAction = 
	ToggleTab |
	ASA_Project_Changed |
	ASA_Set_Viewport
