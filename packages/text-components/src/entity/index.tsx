import React from 'react'
import styled from 'styled-components'
import { Popup } from '../popup'
import { useEntityData, useChildren, ExtractEntityKey, ExtractEntityValue, ExtractEntityType } from './hooks'
import type { DocereComponentProps, EntityConfig } from '@docere/common'
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
	extractType: ExtractEntityType
	extractKey?: ExtractEntityKey
	extractValue?: ExtractEntityValue
	PopupBody?: React.FC<DocereComponentProps>
}

export default function getEntity(preProps: PreProps) {
	preProps = {...defaultPreProps, ...preProps}

	return function Entity(props: DocereComponentProps) {
		const entityValue = preProps.extractValue(props)
		if (!props.entrySettings['panels.text.showEntities']) return <span>{entityValue}</span>

		const navigate = props.useNavigate()
		const [entity, config] = useEntityData(preProps.extractType, preProps.extractKey, props)
		const [children, firstWord, restOfFirstChild] = useChildren(entityValue, config)

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

			navigate({
				type: 'entry',
				id: props.entry.id,
				query: {
					entity: {
						id: entity.id,
						type: entity.type
					}
				}
			})

			setShowTooltip(true)
		}, [entity?.id, navigate])

		// Only abort when config does not exist. The entity is not necessary for rendering
		if (config == null) return null

		const Icon = IconsByType[config.type]

		const openToAside = active && !props.entrySettings['panels.text.openPopupAsTooltip']

		return (
			<EntityWrapper
				active={active}
				config={config}
				onClick={handleClick}
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
						docereComponentProps={props}
						openToAside={openToAside}
						PopupBody={preProps.PopupBody}
						title={config.title}
					/>
				</NoWrap>
				{restOfFirstChild}
				{children.slice(1)}
			</EntityWrapper>
		)
	}
}
