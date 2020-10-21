import React from 'react'
import styled from 'styled-components'
import { DocereComponentProps, Entity } from '@docere/common'

import { Popup } from '../popup'
import { useEntity, useChildren, ExtractEntityKey, ExtractEntityValue } from './hooks'
import IconsByType from './icons'

import type { PopupBodyProps } from '../popup'

interface NWProps { openToAside: boolean }
const NoWrap = styled.span`
	display: inline-block;
	position: ${(props: NWProps) => props.openToAside ? 'static' : 'relative'};
	white-space: nowrap;
`

const EntityWrapper = styled.span`
	background-color: ${(props: { entity: Entity, active: boolean }) => {
		return props.active ? props.entity.color : 'rgba(0, 0, 0, 0)'
	}};
	${props => 
		props.active ?
			`border-bottom: 3px solid ${props.color};` :
			props.entity.revealOnHover ?
				`&:hover {
					border-bottom: 3px solid ${props.entity.color};
				}` :
				`border-bottom: 3px solid ${props.entity.color};`
	}
	color: ${props => props.active ? 'white' : 'inherit'};
	cursor: pointer;
	padding: 0 2px;
	transition: all 300ms;

	svg.icon {
		height: .85em;
	}
`

const defaultPreProps: Omit<PreProps, 'extractType'> = {
	extractKey: (props) => props.attributes.key,
	extractValue: (props) => props.children
}

interface PreProps {
	// extractType: ExtractEntityType
	extractKey?: ExtractEntityKey // Extract the entity ID 
	extractValue?: ExtractEntityValue // Extract the entity text content (not the note body!)
	PopupBody?: React.FC<PopupBodyProps>
}

export default function getEntity(preProps?: PreProps) {
	preProps = {...defaultPreProps, ...preProps}

	return function Entity(props: DocereComponentProps) {
		const entityValue = preProps.extractValue(props)
		if (!props.entrySettings['panels.text.showEntities']) return <span>{entityValue}</span>

		const entity = useEntity(preProps.extractKey, props)
		const [children, firstWord, restOfFirstChild] = useChildren(entityValue, entity)

		// The entity can be active, but without the need to show the tooltip.
		// In case there are several entities with the same ID, we only want to 
		// show the tooltip of the entity that was clicked. The others are highlighted,
		// but only the clicked entity shows its tooltip
		const [showTooltip, setShowTooltip] = React.useState(false)
		const [active, setActive] = React.useState(false)

		React.useEffect(() => {
			if (entity == null) return
			// const nextActive = entity != null && props.activeEntity != null && props.activeEntity.id === entity.id
			const nextActive = props.activeEntities?.has(entity.id)
			if (nextActive) console.log(nextActive, entity.id, showTooltip)
			setActive(nextActive === true)
			if (!nextActive && showTooltip) setShowTooltip(false)
		}, [entity, props.activeEntities])

		const handleClick = React.useCallback(ev => {
			ev.stopPropagation()

			props.entryDispatch({
				type: 'SET_ENTITY',
				id: entity.id
			})

			setShowTooltip(true)
		}, [entity?.id])

		if (entity == null) return null

		const Icon = IconsByType[entity.type]

		const openToAside = active && !props.entrySettings['panels.text.openPopupAsTooltip']

		return (
			<EntityWrapper
				active={active}
				entity={entity}
				onClick={handleClick}
			>
				<NoWrap
					openToAside={openToAside}
				>
					{
						Icon != null &&
						<Icon
							active={active}
							entity={entity}
						/>
					}
					{firstWord}
					<Popup
						active={active && showTooltip}
						docereComponentProps={props}
						entity={entity}
						openToAside={openToAside}
						PopupBody={preProps.PopupBody}
					/>
				</NoWrap>
				{restOfFirstChild}
				{children.slice(1)}
			</EntityWrapper>
		)
	}
}
