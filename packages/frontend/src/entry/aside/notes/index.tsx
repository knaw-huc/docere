import * as React from 'react'
import NoteList from "./list"
import { useTextData, Wrapper } from '../list'
import AppContext, { useComponents } from '../../../app/context'
import { DocereComponentContainer } from '@docere/common'
import type { EntryState, AppStateAction, Entry, EntryStateAction } from '@docere/common'

// type Props =
// 	Pick<EntryState,  'activeNote' | 'layers'> &

type Props = Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'settings'> & {
	active: boolean
	appDispatch: React.Dispatch<AppStateAction>
	entry: Entry
	entryDispatch: React.Dispatch<EntryStateAction>
}

function NotesAside(props: Props) {
	const appContext = React.useContext(AppContext)
	const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
	const [notesByType, noteTypes, activeNoteType, setActiveType] = useTextData(props.entry.notes, props.activeNote)
	const components = useComponents(DocereComponentContainer.Notes)

	return (
		<Wrapper
			active={props.active}
			ref={wrapperRef}
		>
			{
				noteTypes.map(noteType =>
					<NoteList
						active={activeNoteType === noteType}
						activeEntity={props.activeEntity}
						activeFacsimile={props.activeFacsimile}
						activeFacsimileAreas={props.activeFacsimileAreas}
						activeNote={props.activeNote}
						appDispatch={props.appDispatch}
						components={components}
						config={appContext.config.notes.find(nc => nc.id === noteType)}
						containerHeight={wrapperRef.current.getBoundingClientRect().height}
						entry={props.entry}
						entryDispatch={props.entryDispatch}
						notesByType={notesByType}
						key={noteType}
						setActiveType={setActiveType}
						settings={props.settings}
						type={noteType}
					/>
				)
			}
		</Wrapper>

	)
}

export default React.memo(NotesAside)
