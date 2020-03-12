import * as React from 'react'
import { Main } from './index.components'
import Panels from './panels'
import Aside from './aside'
import Footer from './footer'
import useEntryState from './state'

function Entry(props: EntryProps) {
	if (props.entry == null) return null

	const [entryState, entryDispatch] = useEntryState(props.entry)

	return (
		<Main
			asideTab={entryState.asideTab}
			footerTab={entryState.footerTab}
			searchTab={props.searchTab}
		>
			<Panels
				activeEntity={entryState.activeEntity}
				activeNote={entryState.activeNote}
				activeFacsimile={entryState.activeFacsimile}
				activeFacsimileAreas={entryState.activeFacsimileAreas}
				appDispatch={props.appDispatch}
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={props.entry}
				footerTab={entryState.footerTab}
				layers={entryState.layers}
				searchQuery={props.searchQuery}
				searchTab={props.searchTab}
			/>
			<Aside
				activeEntity={entryState.activeEntity}
				activeNote={entryState.activeNote}
				activeFacsimile={entryState.activeFacsimile}
				activeFacsimileAreas={entryState.activeFacsimileAreas}
				appDispatch={props.appDispatch}
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={props.entry}
				layers={entryState.layers}
			/>
			<Footer
				entryDispatch={entryDispatch}
				footerTab={entryState.footerTab}
				layers={entryState.layers}
			/>
		</Main>
	)
}

export default React.memo(Entry)
