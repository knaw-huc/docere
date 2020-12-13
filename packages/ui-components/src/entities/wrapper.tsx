import React from 'react'
import styled from 'styled-components'
import { Entity, EntitiesContext, ContainerContext } from '@docere/common'

const TooltipBody = styled.div`
	background: white;
	border-color: ${(props: { entity: Entity, active?: boolean }) => props.entity.color};
	border-style: solid;
	border-width: 2px;
	box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
	box-sizing: border-box;
	color: #666;
	font-family: sans-serif;
	font-size: .85rem; ${/* Set font-size on TooltipBody, because it is also used when note is in the aside */''}
	font-weight: 300;
	height: 100%;
	line-height: 1.5rem;
`

const Wrapper = styled(TooltipBody)`
	filter: ${(props: any) => props.active ? 'grayscale(0%) opacity(1)' : 'grayscale(100%) opacity(.75)'};
	text-align: left;
	transition: filter 300ms;
`

interface NHProps {
	color: string
}
const Header = styled.header`
	background: ${(props: NHProps) => props.color};
	color: white;
	display: grid;
	font-size: .7rem;
	font-weight: bold;
	grid-template-columns: 1fr 8fr 1fr;
	height: 18px;
	justify-items: center;
	line-height: 18px;
	text-shadow: 1px 1px 0 #888;
	text-transform: uppercase;
`

export interface EntityComponentProps {
	entity: Entity
}

interface Props {
	children: React.ReactNode
	entity: Entity
}
export const EntityWrapper = React.memo(function EntityWrapper(props: Props) {
	const activeEntities = React.useContext(EntitiesContext)
	const container = React.useContext(ContainerContext)
	const ref = React.useRef<HTMLDivElement>()
	const active = activeEntities.has(props.entity.id)

	React.useEffect(() => {
		if (active) {
			const activeEntity = activeEntities.get(props.entity.id)
			
			if (
				!(activeEntity.triggerContainer === container.type &&
				activeEntity.triggerContainerId === container.id)
			){
				ref.current.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				})
			}
		}
	}, [activeEntities.has(props.entity.id)])

	return (
		<Wrapper
			active={active}
			entity={props.entity}
			ref={ref}
		>
			{
				props.entity.title != null &&
				<Header
					color={props.entity.color}
				>
					<span></span>
					<span>{props.entity.title}</span>
					<span></span>
				</Header>
			}
			{ props.children }
		</Wrapper>
	)
})

