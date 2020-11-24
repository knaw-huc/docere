import * as React from 'react'
import styled from 'styled-components'

import { small } from '../../index.components'

import { Entity, useUIComponent, UIComponentType, EntitiesContext } from '@docere/common'

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
	active: boolean
	entity: Entity
}
export function ItemInText(props: Props) {
	const { addActiveEntity } = React.useContext(EntitiesContext)
	const Component = useUIComponent(UIComponentType.Entity, props.entity.configId)

	const handleClick = React.useCallback(() => {
		addActiveEntity(props.entity.id, null, null)
	}, [props.entity])

	if (Component == null) return null

	return (
		<Li
			count={props.entity.count}
			onClick={handleClick}
		>
			<Component
				entity={props.entity}
			/>
		</Li>
	)
}
