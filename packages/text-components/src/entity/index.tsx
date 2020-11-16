import React from 'react'
import styled from 'styled-components'
import { DocereComponentProps, Entity, EntrySettingsContext, EntitiesContext } from '@docere/common'

import { Popup, PopupBodyProps } from '../popup'
import { useEntity, useChildren } from './hooks'
import IconsByType from './icons'

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

// const defaultPreProps: Omit<PreProps, 'extractType'> = {
// 	extractKey: (props) => props.attributes.key,
// 	extractValue: (props) => props.children
// }

// interface PreProps {
// 	// extractType: ExtractEntityType
// 	extractKey?: ExtractEntityKey // Extract the entity ID 
// 	extractValue?: ExtractEntityValue // Extract the entity text content (not the note body!)
// 	PopupBody?: React.FC<PopupBodyProps>
// }

export function getEntity(PopupBody?: React.FC<PopupBodyProps>) {
	return function Entity(props: DocereComponentProps) {
		const { activeEntities, addActiveEntity } = React.useContext(EntitiesContext)
		const { settings } = React.useContext(EntrySettingsContext)
		// const entityValue = preProps.extractValue(props)
		if (!settings['panels.text.showEntities']) return <span>{props.children}</span>

		const entity = useEntity(props.attributes['docere:id'])
		const [children, firstWord, restOfFirstChild] = useChildren(props.children, entity)

		// The entity can be active, but without the need to show the tooltip.
		// In case there are several entities with the same ID, we only want to 
		// show the tooltip of the entity that was clicked. The others are highlighted,
		// but only the clicked entity shows its tooltip
		const [showTooltip, setShowTooltip] = React.useState(false)
		const [active, setActive] = React.useState(false)

		React.useEffect(() => {
			if (entity == null) return
			const nextActive = activeEntities?.has(entity.id)
			setActive(nextActive === true)
			if (!nextActive && showTooltip) setShowTooltip(false)
		}, [entity, activeEntities])

		const handleClick = React.useCallback(ev => {
			ev.stopPropagation()
			addActiveEntity(entity.id, props.layer.id, null)
			setShowTooltip(true)
		}, [entity?.id])

		if (entity == null) return null

		const Icon = IconsByType[entity.type]

		const openToAside = active && !settings['panels.text.openPopupAsTooltip']

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
						PopupBody={PopupBody}
					/>
				</NoWrap>
				{restOfFirstChild}
				{children.slice(1)}
			</EntityWrapper>
		)
	}
}
