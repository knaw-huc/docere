import * as React from 'react'
import EntrySelector from '../entry-selector'
import Header from '../header'
import Entry from '../entry'
import PageView from '../page'
import useAppState from './state'

interface AppProps {
	configData: DocereConfigData
	EntrySelector: typeof EntrySelector
}
function App(props: AppProps): any {
	const [appState, appDispatch] = useAppState(props.configData)

	return (
		<>
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
				searchQuery={appState.searchQuery}
				searchTab={appState.searchTab}
			/>
		</>
	)
}

export default React.memo(App)
