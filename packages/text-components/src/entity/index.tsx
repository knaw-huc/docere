import React from 'react'
import styled, { css } from 'styled-components'
import { EntrySettingsContext, EntitiesContext, useUIComponent, UIComponentType, ContainerContext, DispatchContext, EntityAnnotationComponentProps, EntityConfig, EntryContext } from '@docere/common'

import { useChildren } from './hooks'
import IconsByType from './icons'
import { EntityTooltip } from './entity-tooltip'

const tooltipContainerStyle = css`
	display: inline-block;
	position: relative;
`

/**
 * The tooltip container is used when the tooltip is on the last child.
 * The inline-block collapses the element, which means if the last Child
 * is preceded by a white space, it isn't rendered. This happens often:
 * <frontname>Teddy</frontname><surname> Rooseveldt</surname>. That is 
 * why the `padding-left` prop is added.
 */
const TooltipContainer = styled.span`
	${tooltipContainerStyle}
	padding-left: .25rem;
`

const NoWrap = styled.span`
	${(props: { hasTooltip: boolean }) =>
		props.hasTooltip ? tooltipContainerStyle : ''
	}
	white-space: nowrap;
`

interface WProps { entityConfig: EntityConfig, active: boolean }
const Wrapper = styled.span`
	background-color: ${(props: WProps) => {
		return props.active ? props.entityConfig.color : 'rgba(0, 0, 0, 0)'
	}};
	${(props: WProps) => {
		const underline = `border-bottom: 3px solid ${props.entityConfig.color};`
		return props.active ?
			underline :
			props.entityConfig.revealOnHover ?
				`&:hover {${underline}}` :
				underline
		}
	}
	color: ${props => props.active ? 'white' : 'inherit'};
	cursor: pointer;
	padding: 0 2px;

	svg.icon {
		height: .85em;
	}
`

export const EntityTag = React.memo(function EntityComp(props: EntityAnnotationComponentProps) {
	const dispatch = React.useContext(DispatchContext)
	const activeEntities = React.useContext(EntitiesContext)
	const settings = React.useContext(EntrySettingsContext)
	const container = React.useContext(ContainerContext)
	const entry = React.useContext(EntryContext)

	if (!settings['panels.entities.show']) return <span>{props.children}</span>

	const entity = entry.textData.entities.get(props.annotation.props.entityId)
	const [firstChild, middleChildren, lastChild] = useChildren(props.children, entity)

	const Component = useUIComponent(UIComponentType.Entity, entity?.props.entityConfig.id)

	// The entity can be active, but without the need to show the tooltip.
	// In case there are several entities with the same ID, we only want to 
	// show the tooltip of the entity that was clicked. The others are highlighted,
	// but only the clicked entity shows its tooltip
	const [showTooltip, setShowTooltip] = React.useState(false)
	const [active, setActive] = React.useState(false)

	React.useEffect(() => {
		if (entity == null) return
		const nextActive = activeEntities?.has(entity.props.entityId)
		setActive(nextActive === true)
		if (!nextActive && showTooltip) setShowTooltip(false)
	}, [entity, activeEntities])

	const handleClick = React.useCallback(ev => {
		ev.stopPropagation()
		dispatch({
			type: 'ADD_ENTITY',
			entityId: entity.props.entityId,
			triggerContainer: container.type,
			triggerContainerId: container.id,
		})
		setShowTooltip(true)
	}, [entity])

	if (entity == null) {
		console.error(`[DOCERE] Entity '${props.annotation.props.entityId}' not found`, props.annotation)
		return null
	}

	const Icon = IconsByType[entity.props.entityConfig.type]

	const tooltip = active && showTooltip ?
		<EntityTooltip
			entity={entity}
			settings={settings}
		>
			<Component
				entity={entity}
			/>
		</EntityTooltip> : null

	return (
		<Wrapper
			active={active}
			data-entity-id={entity.props.entityId}
			entityConfig={entity.props.entityConfig}
			onClick={handleClick}
		>
			<NoWrap hasTooltip={lastChild == null}>
				{
					Icon != null &&
					<Icon
						active={active}
						entity={entity}
						entityConfig={entity.props.entityConfig}
					/>
				}
				{firstChild || "CLICK HERE"}
				{
					lastChild == null &&
					tooltip
				}
			</NoWrap>
			{middleChildren}
			{
				lastChild != null &&
				<TooltipContainer className="last">
					{lastChild}
					{tooltip}
				</TooltipContainer>
			}
		</Wrapper>
	)
})
// }

						// <EntityWrapper
						// 	entity={entity}
						// 	isPopup={openToAside}
						// 	PopupBody={PopupBody}
						// />
