import * as React from 'react'
import { SearchTab, Viewport } from '@docere/common'

import getEntry from './get-entry'
// import HistoryNavigator from './history-navigator'

import type { AppState, AppStateAction, DocereConfigData } from '@docere/common'
import { useParams } from 'react-router-dom'

const initialAppState: AppState = {
	entry: null,
	footerTab: null,
	searchTab: null,
	viewport: Viewport.EntrySelector
}

function appStateReducer(appState: AppState, action: AppStateAction): AppState {
	if ((window as any).DEBUG) console.log('[AppState]', action)

	switch (action.type) {
		// case 'PROJECT_CHANGED': {
		// 	let viewport = appState.viewport
		// 	if (action.entryId != null) viewport = Viewport.Entry

		// 	return {
		// 		...appState,
		// 		entryId: action.entryId,
		// 		pageId: action.pageId,
		// 		viewport,
		// 	}
		// }

		// case 'SET_ENTRY_ID': {
		// 	// searchTab cannot be Search when viewport is Entry
		// 	const searchTab = appState.searchTab === SearchTab.Search ?
		// 		null :
		// 		appState.searchTab

		// 	return {
		// 		...appState,
		// 		entryId: action.id,
		// 		searchTab,
		// 		viewport: Viewport.Entry,
		// 	}
		// }

		case 'SET_ENTRY': {
			return {
				...appState,
				entry: action.entry,
		 		viewport: Viewport.Entry,
			}
		}

		// case 'SET_PAGE_ID': {
		// 	return {
		// 		...appState,
		// 		pageId: action.id,
		// 	}
		// }

		// case 'SET_PAGE': {
		// 	return {
		// 		...appState,
		// 		page: action.page,
		// 	}
		// }

		// case 'UNSET_PAGE': {
		// 	return {
		// 		...appState,
		// 		page: null,
		// 		pageId: null
		// 	}
		// }

		// case 'SET_SEARCH_TAB': {
		// 	// if searchTab is Search, viewport has to be EntrySelector
		// 	// and if searchTab is Results, viewport has to be Entry
		// 	const viewport = action.tab === SearchTab.Search ?
		// 		Viewport.EntrySelector :
		// 		Viewport.Entry

		// 	const searchTab = appState.searchTab === action.tab ? null : action.tab

		// 	return {
		// 		...appState,
		// 		searchTab,
		// 		viewport
		// 	}
		// }

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
export default function useAppState(configData: DocereConfigData) {
	const x = React.useReducer(appStateReducer, initialAppState)
	const { entryId } = useParams()

	React.useEffect(() => {
		if (entryId == null) return
		getEntry(entryId, configData).then(entry => x[1]({ type: 'SET_ENTRY', entry }))
	}, [entryId])

	// React.useEffect(() => {
	// 	if (x[0].entryId == null) return
	// }, [configData, x[0].entryId])

	// React.useEffect(() => {
	// 	if (x[0].pageId == null) return
	// 	getPage(x[0].pageId, configData.config).then(page => x[1]({ type: 'SET_PAGE', page }))
	// }, [configData, x[0].pageId])

	// React.useEffect(() => {
		// if (x[0].page != null) {
		// 	historyNavigator.push(
		// 		`/${configData.config.slug}/pages/${x[0].pageId}`,
		// 		`${configData.config.title} - ${x[0].page.title}`,
		// 		{ viewport: x[0].viewport.toString(), id: x[0].pageId }
		// 	)
		// }

		// if (x[0].viewport === Viewport.EntrySelector) {
		// 	historyNavigator.push(
		// 		`/projects/${configData.config.slug}`,
		// 		`${configData.config.title} - Search`,
		// 		{ viewport: x[0].viewport.toString() }
		// 	)
		// }

		// else if (x[0].viewport === Viewport.Entry) {
		// 	historyNavigator.push(
		// 		`/projects/${configData.config.slug}/entries/${x[0].entryId}`,
		// 		`${configData.config.title} - ${x[0].entryId}`,
		// 		{ viewport: x[0].viewport.toString(), id: x[0].entryId }
		// 	)
		// }
	// }, [x[0].viewport, x[0].entryId, x[0].page])

	return x
}
