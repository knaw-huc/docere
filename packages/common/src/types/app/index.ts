import { SearchTab, Viewport, FooterTab } from '../../enum'

export interface ProjectUIState {
	footerTab: FooterTab
	searchTab: SearchTab
	viewport: Viewport
}

interface ProjectChanged {
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

interface SetViewport {
	type: 'SET_VIEWPORT'
	viewport: Viewport
}

export type ProjectUIAction = 
	ToggleTab |
	ProjectChanged |
	SetViewport
