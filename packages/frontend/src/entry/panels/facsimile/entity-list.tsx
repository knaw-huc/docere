import styled from 'styled-components'
import React from 'react'
import { EntitiesContext, ActiveEntity, useUIComponent, UIComponentType } from '@docere/common'

const Wrapper = styled.ul`
	display: none;
	position: absolute;
	top: 0;
	left: 0;
`

export function EntityList() {
	const activeEntities = React.useContext(EntitiesContext)

	return (
		<Wrapper>
			{
				Array.from(activeEntities.values()).map(entity =>
					<EntityItem
						entity={entity}
						key={entity.id}
					/>
				)
			}
		</Wrapper>
	)
}

const Item = styled.div`
	z-index: 1;
`

function EntityItem(props: { entity: ActiveEntity }) {
	const Component = useUIComponent(UIComponentType.Entity, props.entity.configId)
	return (
		<Item
			data-id={`entity_${props.entity.id}`}
		>
			<Component entity={props.entity} />
		</Item>
	)
}
