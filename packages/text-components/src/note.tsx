import React from 'react'
import type { DocereComponentProps } from '@docere/common'
import styled from 'styled-components'
import Popup from './popup'

interface NAProps { active: boolean, color: string, openToAside: boolean }
const Wrapper = styled.div`
	background-color: ${(props: NAProps) => props.active ? props.color : 'white' };
	border-radius: 0.2em;
	color: ${props => props.active ? 'white' : props.color };
	cursor: pointer;
	display: inline-block;
	font-family: monospace;
	font-size: .75rem;
	font-weight: bold;
	line-height: 1rem;
	min-width: 1rem;
	padding: 0.1em;
	position: ${props => props.openToAside ? 'static' : 'relative'};
	text-align: center;
	transition: all 150ms;
	vertical-align: super;
`

export default function getNote(extractNoteId: (props: DocereComponentProps) => string) {
	return function Note(props: DocereComponentProps) {
		if (!props.entrySettings['panels.text.showNotes']) return <span>{props.children}</span>

		const noteId = extractNoteId(props)
		const note = props.entry.notes.find(x => x.id === noteId)
		if (note == null) return null

		const active = note.id === props.activeNote?.id

		const openToAside = active && !props.entrySettings['panels.text.openPopupAsTooltip']

		return (
			<Wrapper
				active={active}
				className="note"
				color={note.color}
				id={note.id}
				onClick={() => {
					props.entryDispatch({ type: 'SET_NOTE', id: note.id })
				}}
				openToAside={openToAside}
			>
				{note.n}
				<Popup
					active={active}
					color={note.color}
					docereComponentProps={props}
					node={note.el}
					openToAside={openToAside}
					title={note.title}
				/>
			</Wrapper>
		)
	}
}
