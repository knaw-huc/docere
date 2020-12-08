import React from 'react'
import styled from 'styled-components'
import { EntryContext, FOOTER_HANDLE_HEIGHT, ActiveEntities } from '@docere/common'

import { ItemInText } from './item'

export const List = styled.ul`
`

export const EntityListAsideWrapper = styled(EntityList)`
	height: calc(100% - ${FOOTER_HANDLE_HEIGHT}px);
	overflow: auto;
`

export function EntityListAside() {
	const entry = React.useContext(EntryContext)

	return <EntityListAsideWrapper entities={entry.textData.entities} />

	// return (
	// 	<Wrapper>
	// 		{
	// 			Array.from(entry.textData.entities.values())
	// 				.map((entity) =>
	// 					<ItemInText
	// 						entity={entity}
	// 						key={entity.id}
	// 					/>
	// 				)
	// 		}
	// 	</Wrapper>

	// )
}

export function EntityList(props: { entities: ActiveEntities }) {
	return (
		<List>
			{
				Array.from(props.entities.values())
					.map((entity) =>
						<ItemInText
							entity={entity}
							key={entity.id}
						/>
					)
			}
		</List>
	)
}
