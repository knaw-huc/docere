import React from 'react'
import { SearchTab, Viewport } from '@docere/common'

import type { ProjectUIState, ProjectUIAction } from '@docere/common'
import { useParams } from 'react-router-dom'

const initialProjectUIState: ProjectUIState = {
	footerTab: null,
	searchTab: null,
	viewport: Viewport.EntrySelector
}

function projectUIReducer(state: ProjectUIState, action: ProjectUIAction): ProjectUIState {
	if ((window as any).DEBUG) console.log('[AppState]', action)

	switch (action.type) {
		case 'TOGGLE_TAB': {
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

		case 'SET_VIEWPORT': {
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

		default:
			break
	}

	return state
}

interface ProjectUIContextValue {
	state: ProjectUIState,
	dispatch: React.Dispatch<ProjectUIAction>
}
const initialProjectUIContext: ProjectUIContextValue = {
	state: initialProjectUIState,
	dispatch: null,
}
export const ProjectUIContext = React.createContext(initialProjectUIContext)

function useIt() {
	const [state, dispatch] = React.useReducer(projectUIReducer, initialProjectUIState)
	const { entryId } = useParams()
	let [b, setB] = React.useState<any>(null)

	// TODO should this be the other way around? Change the URL based
	// on setting the appstate viewport?
	React.useEffect(() => {
		if (entryId != null && state.viewport !== Viewport.Entry) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.Entry })
		} else if (entryId == null && state.viewport !== Viewport.EntrySelector) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.EntrySelector })
		}
	}, [entryId])

	React.useEffect(() => {
		setB({ state, dispatch })
	}, [state])

	return b
}

// let historyNavigator: HistoryNavigator
export function ProjectUIProvider(props: { children: React.ReactNode }) {
	const a = useIt()
	if (a == null) return null

	return (
		<ProjectUIContext.Provider value={a}>
			{props.children}
		</ProjectUIContext.Provider>
	) 
}
