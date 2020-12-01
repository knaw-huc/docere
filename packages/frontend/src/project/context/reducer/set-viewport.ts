import { Viewport, SearchTab, ProjectState, SetViewport } from '@docere/common'

export function setViewport(state: ProjectState, action: SetViewport): ProjectState {
	let searchTab = state.searchTab

	// if viewport is EntrySelector, searchTab has to be Search
	if (action.viewport === Viewport.EntrySelector) searchTab = SearchTab.Search

	// if viewport is Entry, searchTab cannot be Search
	if (action.viewport === Viewport.Entry && state.searchTab === SearchTab.Search) searchTab = null

	return {
		...state,
		searchTab,
		viewport: action.viewport
	}
}
