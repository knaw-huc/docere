import React from 'react'
import styled from 'styled-components'
import { Entity, EntitiesContext, LayerContext, DocereComponentContainer } from '@docere/common'

import { TooltipBody } from './tooltip'

export * from './body'

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
	const layer = React.useContext(LayerContext)
	const ref = React.useRef<HTMLDivElement>()
	const active = activeEntities.has(props.entity.id)

	React.useEffect(() => {
		if (active) {
			const activeEntity = activeEntities.get(props.entity.id)
			if (
				activeEntity.triggerContainer !== DocereComponentContainer.Layer ||
				activeEntity.triggerContainerId !== layer?.id
			){
				ref.current.scrollIntoView()
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

const PlainTextBody = styled.div`
	padding: .25rem .5rem;
`
export function EntityWithPlainTextBody(props: EntityComponentProps) {
	return (
		<EntityWrapper entity={props.entity}>
			<PlainTextBody>
				{props.entity.content}
			</PlainTextBody>
		</EntityWrapper>
	)
}
