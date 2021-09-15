import React from 'react'
import styled from 'styled-components'
import { LbCommon } from '@docere/text-components'

import { DispatchContext, useEntity, EntitiesContext, ContainerContext, EntityAnnotationComponentProps } from '@docere/common'

export const LbWrapper = styled.div`
	&:before {
		content: counter(session);
		counter-increment: session;
		cursor: pointer;
		${LbCommon}
		${(props: { active: boolean, color: string }) =>
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

	const entity = useEntity(props.annotation.metadata.entityId)

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.metadata.entityId,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity])

	if (entity == null) return null

	return (
		<LbWrapper
			active={activeEntities.has(entity.metadata.entityId)}
			color={entity.metadata.entityConfig.color}
			data-entity-id={entity.metadata.entityId}
			onClick={handleClick}
		/>
	)
}

export function SessionPart(props: EntityAnnotationComponentProps) {
	const activeEntities = React.useContext(EntitiesContext)
	const dispatch = React.useContext(DispatchContext)
	const container = React.useContext(ContainerContext)

	const entity = useEntity(props.annotation.metadata.entityId)

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()

		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.metadata.entityId,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity])

	if (entity == null) return null

	return (
		<SessionPartWrapper
			active={activeEntities.has(entity.metadata.entityId)}
			color={entity.metadata.entityConfig.color}
		>
			<h4 onClick={handleClick}>{entity.metadata.entityConfig.title}</h4>
			{props.children}
		</SessionPartWrapper>
	)
}

const SessionPartWrapper = styled.div`
	counter-reset: session;

	h4 {
		color: ${(props: { active: boolean, color: string }) => props.active ? props.color : 'initial'};
		cursor: pointer;
	}
`
