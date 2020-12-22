import React from 'react'
import styled from 'styled-components'
import { EntryContext, FOOTER_HANDLE_HEIGHT, ContainerType } from '@docere/common'

import { ItemInText } from './item'
import { ContainerProvider } from '../../panels/text/layer-provider'
import { useScrollIntoView } from '../../use-scroll-into-view'

export const List = styled.ul`
	height: calc(100% - ${FOOTER_HANDLE_HEIGHT}px);
	overflow: auto;
`

export function EntityListAside() {
	const entry = React.useContext(EntryContext)
	const ref = React.useRef<HTMLUListElement>()
	useScrollIntoView(ref, ContainerType.Aside, 'entities')

	return (
		<ContainerProvider type={ContainerType.Aside} id="entities">
			<List
				data-scroll-container="true"
				ref={ref}
			>
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
}
