import React from 'react'
import styled from 'styled-components'
import { EntitiesContext, EntryContext, FOOTER_HANDLE_HEIGHT } from '@docere/common'

import { ItemInText } from './item'

export const Wrapper = styled.ul`
	height: calc(100% - ${FOOTER_HANDLE_HEIGHT}px);
	overflow: auto;
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
