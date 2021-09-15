import styled from 'styled-components'
import React from 'react'
import { EntitiesContext, useUIComponent, UIComponentType } from '@docere/common'
import { EntityComponentProps } from '@docere/ui-components'

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
				Array.from(activeEntities.values())
					.filter(entity => Array.isArray(entity.metadata.areas))
					.map(entity =>
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

function EntityItem(props: EntityComponentProps) {
	const Component = useUIComponent(UIComponentType.Entity, props.entity.metadata.entityConfigId)
	if (Component == null) {
		console.error('[EntityItem] Component not found!')
		return null
	}

	return (
		<Item
			data-id={`entity_${props.entity.metadata.entityId}`}
		>
			<Component entity={props.entity} />
		</Item>
	)
}
