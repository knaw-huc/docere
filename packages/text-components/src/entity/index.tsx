import React from 'react'
import styled from 'styled-components'
import { DocereComponentProps, EntityConfig } from '@docere/common'

import { Popup } from '../popup'
import { useEntity, useChildren, ExtractEntityKey, ExtractEntityValue } from './hooks'
import IconsByType from './icons'

interface NWProps { openToAside: boolean }
const NoWrap = styled.span`
	display: inline-block;
	position: ${(props: NWProps) => props.openToAside ? 'static' : 'relative'};
	white-space: nowrap;
`

const EntityWrapper = styled.span`
	background-color: ${(props: { config: EntityConfig, active: boolean }) => {
		return props.active ? props.config.color : 'rgba(0, 0, 0, 0)'
	}};
	${props => 
		props.active ?
			`border-bottom: 3px solid ${props.config.color};` :
			props.config.revealOnHover ?
				`&:hover {
					border-bottom: 3px solid ${props.config.color};
				}` :
				`border-bottom: 3px solid ${props.config.color};`
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
	extractKey?: ExtractEntityKey
	extractValue?: ExtractEntityValue
	PopupBody?: React.FC<DocereComponentProps>
}

export default function getEntity(preProps?: PreProps) {
	preProps = {...defaultPreProps, ...preProps}

	return function Entity(props: DocereComponentProps) {
		const entityValue = preProps.extractValue(props)
		if (!props.entrySettings['panels.text.showEntities']) return <span>{entityValue}</span>

		const entity = useEntity(preProps.extractKey, props)
		const [children, firstWord, restOfFirstChild] = useChildren(entityValue, entity?.config)

		// The entity can be active, but without the need to show the tooltip.
		// In case there are several entities with the same ID, we only want to 
		// show the tooltip of the entity that was clicked. The others are highlighted,
		// but only the clicked entity shows its tooltip
		const [showTooltip, setShowTooltip] = React.useState(false)
		const [active, setActive] = React.useState(false)

		React.useEffect(() => {
			const nextActive = entity != null && props.activeEntity != null && props.activeEntity.id === entity.id
			setActive(nextActive)
			if (!nextActive && showTooltip) setShowTooltip(false)
		}, [entity, props.activeEntity])

		const handleClick = React.useCallback(ev => {
			ev.stopPropagation()

			props.entryDispatch({
				type: 'SET_ENTITY',
				id: entity.id
			})

			setShowTooltip(true)
		}, [entity?.id])

		if (entity == null) return null

		const Icon = IconsByType[entity.config.type]

		const openToAside = active && !props.entrySettings['panels.text.openPopupAsTooltip']

		return (
			<EntityWrapper
				active={active}
				config={entity.config}
				onClick={handleClick}
			>
				<NoWrap
					openToAside={openToAside}
				>
					{
						Icon != null &&
						<Icon
							active={active}
							config={entity.config}
						/>
					}
					{firstWord}
					<Popup
						active={active && showTooltip}
						color={entity.config.color}
						docereComponentProps={props}
						openToAside={openToAside}
						PopupBody={preProps.PopupBody}
						title={entity.config.title}
					/>
				</NoWrap>
				{restOfFirstChild}
				{children.slice(1)}
			</EntityWrapper>
		)
	}
}
