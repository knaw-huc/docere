import React from 'react'
import styled from 'styled-components'
import { DocereComponentProps, EntrySettingsContext, EntitiesContext } from '@docere/common'
import { Popup } from './popup'
import { useEntity } from './entity/hooks'

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

// TODO merge getNote with getEntity
// export default function getNote(extractNoteId: ExtractNoteId) {
export const Note = React.memo(function Note(props: DocereComponentProps) {
	const { activeEntities, addActiveEntity } = React.useContext(EntitiesContext)
	const { settings } = React.useContext(EntrySettingsContext)

	if (
		!settings['panels.text.showNotes']
	) return <span>{props.children}</span>

	const note = useEntity(props.attributes['docere:id'])

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
})
