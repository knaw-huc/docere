import React from 'react'
import styled from 'styled-components'
import { DocereComponentProps, Entity, EntrySettingsContext, EntitiesContext, EntryContext } from '@docere/common'
import { Popup } from './popup'

interface NAProps { active: boolean, color: string, openToAside: boolean }
const Wrapper = styled.div`
	border-radius: 0.2em;
	cursor: pointer;
	display: inline-block;
	font-family: monospace;
	font-size: .75rem;
	font-weight: bold;
	line-height: 1rem;
	min-width: 1rem;
	padding: 0.1em;
	text-align: center;
	transition: all 150ms;
	vertical-align: super;

	background-color: ${(props: NAProps) => props.active ? props.color : 'white' };
	color: ${props => props.active ? 'white' : props.color };

	position: ${props => props.openToAside ? 'static' : 'relative'};
`

function useNote(extractNoteId: ExtractNoteId, props: DocereComponentProps) {
	const entry = React.useContext(EntryContext)
	const [note, setNote] = React.useState<Entity>(null)

	React.useEffect(() => {
		const noteId = extractNoteId(props)
		const note = entry.textData.entities.get(noteId)
		setNote(note)
	}, [entry])

	return note
}

type ExtractNoteId = (props: DocereComponentProps) => string

export default function getNote(extractNoteId: ExtractNoteId) {
	return function Note(props: DocereComponentProps) {
		const { activeEntities, addActiveEntity } = React.useContext(EntitiesContext)
		const { settings } = React.useContext(EntrySettingsContext)

		if (
			!settings['panels.text.showNotes']
		) return <span>{props.children}</span>

		const note = useNote(extractNoteId, props)

		const active = activeEntities.has(note?.id)
		const openToAside = active && !settings['panels.text.openPopupAsTooltip']

		const handleClick = React.useCallback(() => {
			addActiveEntity(note.id, props.layer.id, null)
		}, [note, active])

		if (note == null) return null

		return (
			<Wrapper
				active={active}
				className="note"
				color={note.color}
				id={note.id}
				onClick={handleClick}
				openToAside={openToAside}
			>
				{note.n}
				<Popup
					active={active}
					docereComponentProps={props}
					entity={note}
					openToAside={openToAside}
					xml={note.content}
				/>
			</Wrapper>
		)
	}
}
