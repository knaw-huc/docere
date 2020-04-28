import * as React from 'react'
import { Main } from './index.components'
import Panels from './panels'
import Aside from './aside'
import Footer from './footer'
import useEntryState from './state'
import { AppState, AppStateAction } from '@docere/common'

export type EntryProps = Pick<AppState, 'entry' | 'searchTab'> & { appDispatch: React.Dispatch<AppStateAction> }
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
				{...props}
				{...entryState}
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
				settings={entryState.settings}
			/>
			<Footer
				activeFacsimile={entryState.activeFacsimile}
				entryDispatch={entryDispatch}
				entry={props.entry}
				entrySettings={entryState.settings}
				footerTab={entryState.footerTab}
				layers={entryState.layers}
			/>
		</Main>
	)
}

export default React.memo(Entry)
