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
					.filter(entity => Array.isArray(entity.props._areas))
					.map(entity =>
						<EntityItem
							entity={entity}
							key={entity.props.key}
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
	const Component = useUIComponent(UIComponentType.Entity, props.entity.props._entityConfigId)
	if (Component == null) {
		console.error('[EntityItem] Component not found!')
		return null
	}

	return (
		<Item
			data-id={`entity_${props.entity.props._entityId}`}
		>
			<Component entity={props.entity} />
		</Item>
	)
}
