import React from 'react'
import styled from 'styled-components'
import { EntrySettingsContext, EntitiesContext, DocereComponentContainer, ComponentProps, LayerContext, DispatchContext, useEntity } from '@docere/common'
import { XmlEntity } from '@docere/ui-components'

import Tooltip from './tooltip'

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
export const NoteTag = React.memo(function NotePopup(props: ComponentProps) {
	const dispatch = React.useContext(DispatchContext)
	const activeEntities = React.useContext(EntitiesContext)
	const settings = React.useContext(EntrySettingsContext)
	const layer = React.useContext(LayerContext)

	if (
		!settings['panels.text.showNotes']
	) return <span>{props.children}</span>

	const note = useEntity(props.attributes['docere:id'])

	const active = activeEntities.has(note?.id)
	const openToAside = active && !settings['panels.text.openPopupAsTooltip']

	const handleClick = React.useCallback(() => {
		dispatch({
			entityId: note.id,
			type: 'ADD_ENTITY',
			triggerContainer: DocereComponentContainer.Layer,
			triggerContainerId: layer.id
		})
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
				<Tooltip
					entity={note}
					settings={settings}
				>
					<XmlEntity entity={note} />
				</Tooltip>
			}
		</Wrapper>
	)
})
