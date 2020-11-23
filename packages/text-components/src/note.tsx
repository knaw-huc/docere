import React from 'react'
import styled from 'styled-components'
import { DocereComponentProps, EntrySettingsContext, EntitiesContext, useComponents, DocereComponentContainer } from '@docere/common'
import DocereTextView from '@docere/text'

import { Popup, EntityComponentProps } from './popup'
import { useEntity } from './entity/hooks'

const Body = styled.div`
	padding: 1rem;
`

export const NoteBody = React.memo(function NoteBody(props: EntityComponentProps) {
	const components = useComponents(DocereComponentContainer.Layer, props.entity.layerId)
	return (
		<Body>
			<DocereTextView 
				// customProps={props.docereComponentProps}
				components={components}
				xml={props.entity.content}
			/>
		</Body>
	)
})

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
			{
				active &&
				<Popup
					entity={note}
					isPopup={openToAside}
					PopupBody={NoteBody}
				/>
			}
		</Wrapper>
	)
})
