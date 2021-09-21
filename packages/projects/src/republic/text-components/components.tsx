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
			<H4
				active={activeEntities.has(entity.props.entityId)}
				color={entity.props.entityConfig.color}
			>
				{
					entry.partId === 'session' ?
						<EntryLink id={entity.props.entityId}>
							{entity.props.entityConfig.title}
						</EntryLink> :
						<>{entity.props.entityConfig.title}</>
				}
				<span
					className="toggle-area"
					onClick={handleClick}
				>
					<svg viewBox="0 0 612 612">
						<g>
							<path d="M609.608,315.426c3.19-5.874,3.19-12.979,0-18.853c-58.464-107.643-172.5-180.72-303.607-180.72
								S60.857,188.931,2.393,296.573c-3.19,5.874-3.19,12.979,0,18.853C60.858,423.069,174.892,496.147,306,496.147
								S551.143,423.069,609.608,315.426z M306,451.855c-80.554,0-145.855-65.302-145.855-145.855S225.446,160.144,306,160.144
								S451.856,225.446,451.856,306S386.554,451.855,306,451.855z"/>
							<path d="M306,231.67c-6.136,0-12.095,0.749-17.798,2.15c5.841,6.76,9.383,15.563,9.383,25.198c0,21.3-17.267,38.568-38.568,38.568
								c-9.635,0-18.438-3.541-25.198-9.383c-1.401,5.703-2.15,11.662-2.15,17.798c0,41.052,33.279,74.33,74.33,74.33
								s74.33-33.279,74.33-74.33S347.052,231.67,306,231.67z"/>
						</g>
					</svg>
				</span>
				{
					entity.props.entityConfigId === 'resolution' && 
					<ResolutionCount
						entry={entry}
						resolutionId={entity.props.entityId}
					/>
				}
				<Pb {...props} />
			</H4>
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

const H4 = styled.h4`
	margin: .5rem 0 1rem 0;
	display: grid;
	grid-template-columns: fit-content(0) fit-content(0) auto auto;

	small {
		color: gray;
		cursor: default;
		font-size: .85rem;
		font-family: Roboto, sans-serif;
		padding-left: 1rem;
	}

	.toggle-area {
		align-self: center;
		border-bottom: 1px solid #00000000;
		cursor: pointer;
		display: grid;
		margin-left: .5rem;
		height: 20px;
		width: 20px;

		&:hover {
			border-bottom: 1px solid ${props => props.color};
		}

		svg {
			fill: ${(props: { active: boolean, color: string }) => props.active ? props.color : 'initial'};
			width: 20px;
		}
	}
`
