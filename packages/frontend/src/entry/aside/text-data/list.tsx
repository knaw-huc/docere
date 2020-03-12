import * as React from 'react'
import styled from '@emotion/styled'
import AsideList from '../list'
import ItemInText from './item'

interface AIProps {
	activeIndex: number
	color: string
}
const ActiveIndicator = styled.li`
	background: ${(props: AIProps) => props.activeIndex > -1 ? props.color : 'rgba(0, 0, 0, 0)'};
	height: 48px;
	${(props: AIProps) => props.activeIndex > -1 ? 'box-shadow: 1px 0px 8px #111' : ''};
	position: absolute;
	top: ${(props: AIProps) => props.activeIndex > -1 ? props.activeIndex * 48 : 0}px;
	transition: top 120ms ease-out;
	width: 8px;
`

interface Props {
	active: boolean
	activeEntity: EntryState['activeEntity']
	config: EntityConfig
	containerHeight: number
	entryDispatch: React.Dispatch<EntryStateAction>
	entitiesByType: Map<string, Entity[]>
	setActiveType: (type: string) => void
	type: string
}

function EntityList(props: Props) {
	const color = props.config?.color || 'black'
	const entities = props.entitiesByType.get(props.type)

	return (
		<AsideList
			active={props.active}
			config={props.config}
			containerHeight={props.containerHeight}
			itemCount={entities.length}
			setActiveType={props.setActiveType}
			type={props.type}
			typeCount={props.entitiesByType.size}
		>
			<ActiveIndicator
				activeIndex={entities.findIndex(entity => entity.id === props.activeEntity?.id)}
				color={color}
			/>
			{
				entities
					.map((entity) =>
						<ItemInText
							active={entity.id === props.activeEntity?.id}
							entity={entity}
							dispatch={props.entryDispatch}
							key={entity.id}
						/>
					)
			}
		</AsideList>
	)
}

export default React.memo(EntityList)
