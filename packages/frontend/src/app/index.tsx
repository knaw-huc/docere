import * as React from 'react'
import { SearchContext, useSearchReducer } from '@docere/search_'

import EntrySelector from '../entry-selector'
import Header from '../header'
import Entry from '../entry'
import PageView from '../page'
import useAppState from './state'

import type { DocereConfigData } from '@docere/common'
import useFacetsConfig from '../entry-selector/use-fields'

interface AppProps {
	configData: DocereConfigData
	EntrySelector: typeof EntrySelector
}
function App(props: AppProps) {
	const [appState, appDispatch] = useAppState(props.configData)

	const facetsConfig = useFacetsConfig(props.configData.config)
	const [state, dispatch] = useSearchReducer(facetsConfig)

	return (
		<SearchContext.Provider value={{ state, dispatch }}>
			<Header
				appDispatch={appDispatch}
			/>
			<PageView
				appDispatch={appDispatch}
				page={appState.page}
			/>
			<props.EntrySelector
				appDispatch={appDispatch}
				entry={appState.entry}
				searchTab={appState.searchTab}
				viewport={appState.viewport}
			/>
			<Entry 
				appDispatch={appDispatch}
				entry={appState.entry}
				searchTab={appState.searchTab}
			/>
		</SearchContext.Provider>
	)
}

export default React.memo(App)
