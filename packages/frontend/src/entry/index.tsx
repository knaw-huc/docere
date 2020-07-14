import * as React from 'react'
import { Main } from './index.components'
import Panels from './panels'
import Aside from './aside'
import Footer from './footer'
import useEntryState from './state'
import { AppState, AppStateAction } from '@docere/common'

export type EntryProps = Pick<AppState, 'entry' | 'footerTab' | 'searchTab'> & { appDispatch: React.Dispatch<AppStateAction> }
function Entry(props: EntryProps) {
	if (props.entry == null) return null
	const [entryState, entryDispatch] = useEntryState(props.entry)

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
				entry={props.entry}
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
				entry={props.entry}
				layers={entryState.layers}
				entrySettings={entryState.entrySettings}
			/>
			<Footer
				activeFacsimile={entryState.activeFacsimile}
				appDispatch={props.appDispatch}
				asideTab={entryState.asideTab}
				entryDispatch={entryDispatch}
				entry={props.entry}
				entrySettings={entryState.entrySettings}
				footerTab={props.footerTab}
				layers={entryState.layers}
				searchTab={props.searchTab}
			/>
		</Main>
	)
}

export default React.memo(Entry)
