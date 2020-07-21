import * as React from 'react'
import { SearchTab, Viewport, useUrlObject } from '@docere/common'

import type { AppState, AppStateAction } from '@docere/common'

const initialAppState: AppState = {
	footerTab: null,
	searchTab: null,
	viewport: Viewport.EntrySelector
}

function appStateReducer(appState: AppState, action: AppStateAction): AppState {
	if ((window as any).DEBUG) console.log('[AppState]', action)

	switch (action.type) {
		case 'TOGGLE_TAB': {
			if (action.tabType === 'search') {
				const searchTab = appState.searchTab === action.tab ? null : action.tab

				// if searchTab is Search, viewport has to be EntrySelector
				// and if searchTab is Results, viewport has to be Entry
				const viewport = searchTab === SearchTab.Search ?
					Viewport.EntrySelector :
					Viewport.Entry

				return {
					...appState,
					searchTab,
					viewport
				}
			} else if (action.tabType === 'footer') {
				const footerTab = (appState.footerTab === action.tab) ? null : action.tab
				return {
					...appState,
					footerTab,
					searchTab: appState.searchTab === SearchTab.Search ? null : appState.searchTab,
					viewport: Viewport.Entry
				}
			}

		}

		case 'SET_VIEWPORT': {
			let searchTab = appState.searchTab
			// if viewport is EntrySelector, searchTab has to be Search
			if (action.viewport === Viewport.EntrySelector) searchTab = SearchTab.Search
			// if viewport is Entry, searchTab cannot be Search
			if (action.viewport === Viewport.Entry && appState.searchTab === SearchTab.Search) searchTab = null

			return {
				...appState,
				searchTab,
				viewport: action.viewport
			}
		}

		default:
			break
	}

	return appState
}

// let historyNavigator: HistoryNavigator
export default function useAppState() {
	const x = React.useReducer(appStateReducer, initialAppState)
	const { entryId } = useUrlObject()

	React.useEffect(() => {
		if (entryId != null && x[0].viewport !== Viewport.Entry) {
			x[1]({ type: 'SET_VIEWPORT', viewport: Viewport.Entry })
		}
	}, [entryId])

	return x
}
