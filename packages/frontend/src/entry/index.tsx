import * as React from 'react'
import { Main } from './index.components'
import Panels from './panels'
import Aside from './aside'
import Footer from './footer'
import useEntryState from './state'
import { ProjectUIContext } from '../project/ui-context'

function Entry() {
	const { state } = React.useContext(ProjectUIContext)
	const [entryState, entryDispatch] = useEntryState()

	if (entryState.entry == null) return null

	return (
		<Main
			asideTab={entryState.asideTab}
			id="entry-container"
			footerTab={state.footerTab}
			searchTab={state.searchTab}
		>
			<Panels
				{...entryState}
				entryDispatch={entryDispatch}
			/>
			<Aside
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={entryState.entry}
			/>
			<Footer
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={entryState.entry}
				entrySettings={entryState.entrySettings}
				layers={entryState.layers}
			/>
		</Main>
	)
}

export default React.memo(Entry)
