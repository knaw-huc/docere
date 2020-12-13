import React from 'react'
import styled from 'styled-components'
import { EntryContext, FOOTER_HANDLE_HEIGHT, ContainerType } from '@docere/common'

import { ItemInText } from './item'
import { ContainerProvider } from '../../panels/text/layer-provider'

export const List = styled.ul`
	height: calc(100% - ${FOOTER_HANDLE_HEIGHT}px);
	overflow: auto;
`

// export const EntityListAsideWrapper = styled(EntityList)`
// 	height: calc(100% - ${FOOTER_HANDLE_HEIGHT}px);
// 	overflow: auto;
// `

export function EntityListAside() {
	const entry = React.useContext(EntryContext)

	return (
		<ContainerProvider type={ContainerType.Aside} id="entities">
			<List>
				{
					Array.from(entry.textData.entities.values())
						.map((entity) =>
							<ItemInText
								entity={entity}
								key={entity.id}
							/>
						)
				}
			</List>
		</ContainerProvider>
	)

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

// export function EntityList(props: { entities: ActiveEntities }) {
// 	return (
// 	)
// }
