import React from 'react'
import styled from 'styled-components'
import { TEXT_PANEL_TEXT_WIDTH, DEFAULT_SPACING, getTextPanelLeftSpacing, Entity, indexOfIterator, EntrySettingsContext, EntitiesContext } from '@docere/common'

import Tooltip, { TooltipBody } from './tooltip'

import type { DocereConfig } from '@docere/common'

export * from './body'

interface PAW { settings: DocereConfig['entrySettings'] }
const PopupAsideWrapper = styled(TooltipBody)`
	backgroundColor: white;
	height: auto;
	left: ${(props: PAW) => getTextPanelLeftSpacing(props.settings) + TEXT_PANEL_TEXT_WIDTH + DEFAULT_SPACING}px;
	margin-bottom: 5rem;
	margin-top: -1.1rem;
	position: absolute;
	text-align: left;
	width: 240px;
`

interface NHProps {
	color: string
}
const PopupHeader = styled.header`
	background: ${(props: NHProps) => props.color};
	color: white;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 8fr 1fr;
	height: ${DEFAULT_SPACING}px;
	justify-items: center;
	line-height: ${DEFAULT_SPACING}px;
	text-shadow: 1px 1px 0 #888;
	text-transform: uppercase;
`


export interface EntityComponentProps {
	entity: Entity
	// docereComponentProps: DocereComponentProps
}

interface Props {
	entity: Entity
	isPopup?: boolean
	PopupBody: React.FC<EntityComponentProps>
}
export function Popup(props: Props) {
	const { activeEntities } = React.useContext(EntitiesContext)
	const { settings } = React.useContext(EntrySettingsContext)

	const Wrapper = props.isPopup ? PopupAsideWrapper : Tooltip

	return (
		<Wrapper
			entity={props.entity}
			settings={settings}
			zIndexOffset={indexOfIterator(activeEntities, props.entity.id)}
		>
			{
				props.entity.title != null &&
				<PopupHeader
					color={props.entity.color}
				>
					<span></span>
					<span>{props.entity.title}</span>
					<span></span>
				</PopupHeader>
			}
			<props.PopupBody
				entity={props.entity}
			/>
		</Wrapper>
	)
}
Popup.defaultProps = {
	isPopup: false
}
