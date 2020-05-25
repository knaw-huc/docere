import React from 'react'
import styled from 'styled-components'
import Popup from '../popup'
import { useConfig, useChildren } from './hooks'
import type { DocereComponentProps, DocereConfig } from '@docere/common'
import IconsByType from './icons'

interface NWProps { openToAside: boolean }
const NoWrap = styled.span`
	display: inline-block;
	position: ${(props: NWProps) => props.openToAside ? 'static' : 'relative'};
	white-space: nowrap;
`

const EntityWrapper = styled.span`
	background-color: ${(props: Pick<RsProps, 'revealOnHover'> & { active: boolean, color: string }) => {
		return props.active ? props.color : 'rgba(0, 0, 0, 0)'
	}};
	${props => 
		props.active ?
			`border-bottom: 3px solid ${props.color};` :
			props.revealOnHover ?
				`&:hover {
					border-bottom: 3px solid ${props.color};
				}` :
				`border-bottom: 3px solid ${props.color};`
	}
	color: ${props => props.active ? 'white' : 'inherit'};
	cursor: pointer;
	padding: 0 2px;
	transition: all 300ms;

	svg {
		height: 1rem;
	}
`

interface RsProps {
	children: React.ReactNode
	configId?: string
	customProps: DocereComponentProps
	entitiesConfig?: DocereConfig['entities']
	id: string
	onClick?: (ev: any) => void
	PopupBody?: React.FC<DocereComponentProps>
	revealOnHover?: boolean
}
function Entity(props: RsProps) {
	if (!props.customProps.entrySettings['panels.text.showEntities']) return <span>{props.children}</span>

	const active = props.customProps.activeEntity?.id === props.id
	const openToAside = active && !props.customProps.entrySettings['panels.text.openPopupAsTooltip']
	const config = useConfig(props.configId, props.entitiesConfig)
	const [children, firstWord, restOfFirstChild] = useChildren(props.children, config)

	// The entity can be active, but without the need to show the tooltip.
	// In case there are several entities with the same ID, we only want to 
	// show the tooltip of the entity that was clicked. The others are highlighted,
	// but only the clicked entity shows its tooltip
	const [showTooltip, setShowTooltip] = React.useState(false)

	React.useEffect(() => {
		if (!active && showTooltip) setShowTooltip(false)
	}, [active, showTooltip])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()

		if (props.onClick != null) {
			props.onClick(ev)
		} else {
			props.customProps.entryDispatch({
				type: 'SET_ENTITY',
				id: props.id,
			})
		}

		setShowTooltip(true)
	}, [config])

	if (config == null) return null
	const Icon = IconsByType[config.type]

	return (
		<EntityWrapper
			active={active}
			color={config.color}
			onClick={handleClick}
			revealOnHover={props.revealOnHover}
		>
			<NoWrap
				openToAside={openToAside}
			>
				{
					Icon != null &&
					<Icon
						active={active}
						config={config}
					/>
				}
				{firstWord}
				<Popup
					active={active && showTooltip}
					color={config.color}
					docereComponentProps={props.customProps}
					node={config.element}
					openToAside={openToAside}
					PopupBody={props.PopupBody}
					title={config.title}
				/>
			</NoWrap>
			{restOfFirstChild}
			{children.slice(1)}
		</EntityWrapper>
	)
}

Entity.defaultProps = {
	revealOnHover: false,
}

export default Entity
