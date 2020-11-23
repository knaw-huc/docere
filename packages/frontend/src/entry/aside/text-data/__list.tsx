import * as React from 'react'
import { ItemInText } from './item'
import { EntryContext, EntitiesContext, Colors } from '@docere/common'
import styled from 'styled-components'

// interface AIProps {
// 	activeIndex: number
// 	color: string
// }
// const ActiveIndicator = styled.li`
// 	background: ${(props: AIProps) => props.activeIndex > -1 ? props.color : 'rgba(0, 0, 0, 0)'};
// 	height: 48px;
// 	${(props: AIProps) => props.activeIndex > -1 ? 'box-shadow: 1px 0px 8px #111' : ''};
// 	position: absolute;
// 	top: ${(props: AIProps) => props.activeIndex > -1 ? props.activeIndex * 48 : 0}px;
// 	transition: top 120ms ease-out;
// 	width: 8px;
// `


function EntityList() {
	const entry = React.useContext(EntryContext)
	const { activeEntities } = React.useContext(EntitiesContext)

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

export default React.memo(EntityList)
