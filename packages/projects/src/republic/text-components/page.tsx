import React from 'react'
import styled from 'styled-components'
import { EntityTag, LbCommon, Pb } from '@docere/text-components'

import { DocereConfig, ComponentProps, DispatchContext, useEntity, EntitiesContext, ContainerContext, Colors } from '@docere/common'

const LbWrapper = styled.div`
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
	// & > div:first-of-type {
	// 	${LbCommon}
	// 	cursor: pointer;
	// 	${(props: { active: boolean, color: string }) =>
	// 		props.active ?
	// 			`background-color: ${props.color};
	// 			color: white;` :
	// 			''
	// 	}
	// }

function RepublicLb(props: ComponentProps) {
	const dispatch = React.useContext(DispatchContext)
	const container = React.useContext(ContainerContext)
	const activeEntities = React.useContext(EntitiesContext)

	const entity = useEntity(props.attributes['docere:id'])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.id,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity?.id])

	if (entity == null) return null

	return (
		<LbWrapper
			active={activeEntities.has(entity.id)}
			color={entity.color}
			data-entity-id={entity.id}
			onClick={handleClick}
		>
			<div
				onClick={handleClick}
			>
				{entity.n}
			</div>
		</LbWrapper>
	)
}

export default function (_config: DocereConfig) {
	return {
		attendant: EntityTag,
		line: RepublicLb,
		scan: Pb,
		attendance_list: AttendanceList,
		resolution: Resolution,
		paragraph: styled.div`
			margin-bottom: 1rem;
		`
	}
}

function AttendanceList(props: ComponentProps) {
	return (
		<SessionPart
			{...props}
			color={Colors.Red}
			title="Attendance list"
		>
			{props.children}
		</SessionPart>	
	)
}

function Resolution(props: ComponentProps) {
	return (
		<SessionPart
			{...props}
			color={Colors.Red}
			title="Resolution"
		>
			{props.children}
		</SessionPart>	
	)
}


function SessionPart(props: ComponentProps & { color: string, title: string }) {
	const activeEntities = React.useContext(EntitiesContext)
	const dispatch = React.useContext(DispatchContext)
	const container = React.useContext(ContainerContext)

	const entity = useEntity(props.attributes['docere:id'])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()

		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.id,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
	}, [entity?.id])

	if (entity == null) return null

	return (
		<SessionPartWrapper
			active={activeEntities.has(entity.id)}
			color={props.color}
		>
			<h4 onClick={handleClick}>{props.title}</h4>
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
