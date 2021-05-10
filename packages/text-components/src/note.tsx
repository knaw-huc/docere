import React from 'react'
import styled from 'styled-components'
import { EntrySettingsContext, EntitiesContext, ComponentProps, ContainerContext, DispatchContext, useEntity } from '@docere/common'
import { XmlEntity } from '@docere/ui-components'

import { EntityTooltip } from './entity/entity-tooltip'

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
	const container = React.useContext(ContainerContext)

	if (
		!settings['panels.text.showNotes']
	) return <span>{props.children}</span>

	const { entity, entityConfig } = useEntity(props.attributes['docere:id'])

	const active = activeEntities.has(entity?.props._entityId)
	const openToAside = active && !settings['panels.text.openPopupAsTooltip']

	const handleClick = React.useCallback(() => {
		dispatch({
			entityId: entity.props._entityId,
			type: 'ADD_ENTITY',
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity, active])

	if (entity == null) return null

	return (
		<Wrapper
			active={active}
			className="note"
			color={entityConfig.color}
			id={entity.props._entityId}
			onClick={handleClick}
			openToAside={openToAside}
		>
			{entity.props.n}
			{
				active &&
				<EntityTooltip
					entity={entity}
					settings={settings}
				>
					<XmlEntity
						entity={entity}
					/>
				</EntityTooltip>
			}
		</Wrapper>
	)
})
