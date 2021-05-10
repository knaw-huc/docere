import * as React from 'react'
import styled from 'styled-components'

import { small } from '../../index.components'

import { Entity, useUIComponent, UIComponentType, DispatchContext, ContainerContext } from '@docere/common'

const Li = styled.li`
	align-content: center;
	background-color: white;
	color: #CCC;
	cursor: pointer;
	display: grid;
	margin: 1rem;
	min-height: 48px;

	&:after {
		${small}
		color: #777;
		content: ${(props: { count: number }) => props.count > 1 ? `"(${props.count})"` : ''};
	}
`

interface Props {
	entity: Entity
}
export const ItemInText = React.memo(function ItemInText(props: Props) {
	const dispatch = React.useContext(DispatchContext)
	const Component = useUIComponent(UIComponentType.Entity, props.entity.props._entityConfigId)
	const container = React.useContext(ContainerContext)

	const handleClick = React.useCallback(() => {
		dispatch({
			type: 'ADD_ENTITY',
			entityId: props.entity.props._entityId,
			triggerContainer: container.type,
			triggerContainerId: container.id
		})
	}, [props.entity, container])

	if (Component == null) return null

	return (
		<Li
			count={props.entity.props.count}
			data-entity-id={props.entity.props._entityId}
			onClick={handleClick}
		>
			<Component
				entity={props.entity}
			/>
		</Li>
	)
})
