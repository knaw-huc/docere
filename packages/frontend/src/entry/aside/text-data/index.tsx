import React from 'react'
import styled from 'styled-components'
import { EntitiesContext, EntryContext, Colors } from '@docere/common'

import { ItemInText } from './item'

export const Wrapper = styled.div`
	background: ${Colors.Grey};
	bottom: 0;
	height: 100%;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
`
// z-index: ${(p: Pick<Props, 'active'>) => p.active ? 1 : -1};


export function EntitiesAside() {
	const entry = React.useContext(EntryContext)
	const { activeEntities /*, addActiveEntity */ } = React.useContext(EntitiesContext)

	return (
		<Wrapper>
			{
				Array.from(entry.textData.entities.values())
					.map((entity) =>
						<ItemInText
							active={activeEntities.has(entity.id)}
							entity={entity}
							key={entity.id}
						/>
					)
			}
		</Wrapper>

	)
}
