import * as React from 'react'
import AsideList from '../list'
import NoteComp from './note'
import type { EntryState, AppStateAction, DocereComponents, Entry, EntryStateAction, Note, NotesConfig } from '@docere/common'

// interface Props {

type Props = Pick<EntryState, 'activeEntity' | 'activeFacsimile' | 'activeFacsimileAreas' | 'activeNote' | 'entrySettings'> & {
	active: boolean
	appDispatch: React.Dispatch<AppStateAction>
	components: DocereComponents
	config: NotesConfig
	containerHeight: number
	entry: Entry
	entryDispatch: React.Dispatch<EntryStateAction>
	notesByType: Map<string, Note[]>
	setActiveType: (type: string) => void
	type: string
}
function NotesList(props: Props) {
	const notes = props.notesByType.get(props.type)

	return (
		<AsideList
			active={props.active}
			config={props.config}
			containerHeight={props.containerHeight}
			itemCount={notes.length}
			setActiveType={props.setActiveType}
			type={props.type}
			typeCount={props.notesByType.size}
		>
			{
				notes.map(note =>
					<NoteComp
						active={note.id === props.activeNote?.id}
						activeEntity={props.activeEntity}
						activeFacsimile={props.activeFacsimile}
						activeFacsimileAreas={props.activeFacsimileAreas}
						activeNote={props.activeNote}
						appDispatch={props.appDispatch}
						components={props.components}
						entry={props.entry}
						entryDispatch={props.entryDispatch}
						note={note}
						key={note.id}
						listId={props.type}
						entrySettings={props.entrySettings}
					/>
				)
			}
		</AsideList>
	)
}

export default React.memo(NotesList)
