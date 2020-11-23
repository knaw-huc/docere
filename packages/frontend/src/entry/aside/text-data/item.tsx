import * as React from 'react'
import styled from 'styled-components'

import { small } from '../../index.components'

import { Entity, useUIComponent, UIComponentType } from '@docere/common'

const Li = styled.li`
	align-content: center;
	color: #CCC;
	cursor: pointer;
	display: grid;
	height: 48px;
	padding-left: 1em;

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
	const Component = useUIComponent(UIComponentType.Entity, props.entity.configId)

	const handleClick = React.useCallback(() => {
		console.log('click!')
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
