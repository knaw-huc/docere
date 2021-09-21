import React from 'react'
import styled from 'styled-components'
import { LbCommon, Pb } from '@docere/text-components'

import { DispatchContext, useEntity, EntitiesContext, ContainerContext, EntityAnnotationComponentProps, EntryContext, ContainerType, Entry, EntrySettingsContext } from '@docere/common'

export const LbWrapper = styled.div`
	&:before {
		content: counter(session);
		counter-increment: session;
		cursor: pointer;
		display: ${props => props.visible ? 'block' : 'none' };
		${LbCommon}
		${(props: { active: boolean, color: string, visible: boolean }) =>
			props.active ?
				`background-color: ${props.color};
				color: white;` :
				''
		}
	}

`

export function RepublicLb(props: EntityAnnotationComponentProps) {
	const dispatch = React.useContext(DispatchContext)
	const container = React.useContext(ContainerContext)
	const activeEntities = React.useContext(EntitiesContext)
	const settings = React.useContext(EntrySettingsContext)

	const entity = useEntity(props.annotation.props.entityId)

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.props.entityId,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity])

	if (entity == null) return null

	return (
		<LbWrapper
			active={activeEntities.has(entity.props.entityId)}
			color={entity.props.entityConfig.color}
			data-entity-id={entity.props.entityId}
			onClick={handleClick}
			visible={settings['panels.text.showLineBeginnings']}
		/>
	)
}

export function SessionPart(props: EntityAnnotationComponentProps) {
	const activeEntities = React.useContext(EntitiesContext)
	const dispatch = React.useContext(DispatchContext)
	const container = React.useContext(ContainerContext)
	const entry = React.useContext(EntryContext)

	const entity = useEntity(props.annotation.props.entityId)

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()

		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.props.entityId,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity])

	if (entity == null) return null

	return (
		<SessionPartWrapper
			active={activeEntities.has(entity.props.entityId)}
			color={entity.props.entityConfig.color}
		>
			{
				(
					entry.partId === 'resolution' ||
					entry.partId === 'attendance_list'
				) &&
				(
					entity.props.entityConfigId === 'resolution' || 
					entity.props.entityConfigId === 'attendance_list'
				) &&

				<SessionDate entry={entry} />
			}
			<h4 onClick={handleClick}>
				<Pb {...props} />
				{entity.props.entityConfig.title}
				{
					entity.props.entityConfigId === 'resolution' && 
					<ResolutionCount
						entry={entry}
						resolutionId={entity.props.entityId}
					/>
				}
			</h4>
			{
				entry.partId === 'session' &&
				<EntryLink id={entity.props.entityId}>go</EntryLink>
			}
			{props.children}
		</SessionPartWrapper>
	)
}

function SessionDate({ entry }: { entry: Entry }) {
	return (
		<EntryLink id={entry.metadata.get('session_id').value as string}>
			{entry.metadata.get('session_date').value}
		</EntryLink>
	)
}

function ResolutionCount(
	{ resolutionId, entry }: { resolutionId: string, entry: Entry }
) {
	const ids =  entry.metadata.get('resolution_ids').value as string[]
	const index = ids.indexOf(resolutionId)

	let prevId
	let nextId
	if (index > 0) prevId = ids[index - 1]
	if (index < ids.length) nextId = ids[index + 1]

	return (
		<small>
			{
				entry.partId === 'resolution' &&
				prevId != null &&
				<EntryLink id={prevId}>&lt; </EntryLink>
			}
			{index + 1} van {ids.length}
			{
				entry.partId === 'resolution' &&
				nextId != null &&
				<EntryLink id={nextId}> &gt;</EntryLink>
			}
		</small>
	)
}

const SessionPartWrapper = styled.div`
	counter-reset: session;

	span.entry-link {
		font-size: .85rem;

		&:hover {
			color: black;
		}
	}

	h4 {
		color: ${(props: { active: boolean, color: string }) => props.active ? props.color : 'initial'};
		cursor: pointer;
		margin: .5rem 0 1rem 0;

		small {
			color: gray;
			cursor: default;
			font-size: .85rem;
			font-family: Roboto, sans-serif;
			padding-left: 1rem;
		}
	}
`

function EntryLink({ id, children }: { id: string, children: React.ReactNode }) {
	const dispatch = React.useContext(DispatchContext)

	const goToEntry = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()
		dispatch({
			type: 'SET_ENTRY_ID',
			setEntry: {
				entryId: id,
				triggerContainer: ContainerType.Layer
			}
		})
	}, [id])

	return (
		<Wrapper
			className="entry-link"
			onClick={goToEntry}
		>
			{children}
		</Wrapper>
	)
}

const Wrapper = styled.span`
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
`
