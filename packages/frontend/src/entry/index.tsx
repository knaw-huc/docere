import * as React from 'react'
import { Main } from './index.components'
import Panels from './panels'
import Aside from './aside'
import Footer from './footer'
import useEntryState from './state'
import { AppState, AppStateAction } from '@docere/common'

export type EntryProps = Pick<AppState, 'footerTab' | 'searchTab'> & { appDispatch: React.Dispatch<AppStateAction> }
function Entry(props: EntryProps) {
	const [entryState, entryDispatch] = useEntryState()

	if (entryState.entry == null) return null

	return (
		<Main
			asideTab={entryState.asideTab}
			id="entry-container"
			footerTab={props.footerTab}
			searchTab={props.searchTab}
		>
			<Panels
				{...props}
				{...entryState}
				entry={entryState.entry}
				entryDispatch={entryDispatch}
			/>
			<Aside
				activeEntity={entryState.activeEntity}
				activeNote={entryState.activeNote}
				activeFacsimile={entryState.activeFacsimile}
				activeFacsimileAreas={entryState.activeFacsimileAreas}
				appDispatch={props.appDispatch}
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={entryState.entry}
				layers={entryState.layers}
				entrySettings={entryState.entrySettings}
			/>
			<Footer
				activeFacsimile={entryState.activeFacsimile}
				appDispatch={props.appDispatch}
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={entryState.entry}
				entrySettings={entryState.entrySettings}
				footerTab={props.footerTab}
				layers={entryState.layers}
				searchTab={props.searchTab}
			/>
		</Main>
	)
}

export default React.memo(Entry)
