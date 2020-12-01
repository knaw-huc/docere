import { SearchTab, Viewport, ProjectState, ToggleTab } from '@docere/common'

export function toggleTab(state: ProjectState, action: ToggleTab): ProjectState {
	if (action.tabType === 'search') {
		const searchTab = state.searchTab === action.tab ? null : action.tab

		// if searchTab is Search, viewport has to be EntrySelector
		// and if searchTab is Results, viewport has to be Entry
		const viewport = searchTab === SearchTab.Search ?
			Viewport.EntrySelector :
			Viewport.Entry

		return {
			...state,
			searchTab,
			viewport
		}
	} else if (action.tabType === 'footer') {
		const footerTab = (state.footerTab === action.tab) ? null : action.tab
		return {
			...state,
			footerTab,
			searchTab: state.searchTab === SearchTab.Search ? null : state.searchTab,
			viewport: Viewport.Entry
		}
	}

}
