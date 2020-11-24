import React from 'react'
import styled from 'styled-components'
import { Entity } from '@docere/common'

import { TooltipBody } from './tooltip'

// import type { DocereConfig } from '@docere/common'

export * from './body'

// interface PAW { settings: DocereConfig['entrySettings'] }
const Wrapper = styled(TooltipBody)`
	text-align: left;
`
// const popupasidewrapper = styled(tooltipbody)`
// 	backgroundcolor: white;
// 	height: auto;
// 	left: ${(props: paw) => gettextpanelleftspacing(props.settings) + text_panel_text_width + default_spacing}px;
// 	margin-bottom: 5rem;
// 	margin-top: -1.1rem;
// 	position: absolute;
// 	text-align: left;
// 	width: 240px;
// `

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
	// docereComponentProps: DocereComponentProps
}

interface Props {
	children: React.ReactNode
	entity: Entity
	// isPopup?: boolean
	// PopupBody: React.FC<EntityComponentProps>
}
export const EntityWrapper = React.memo(function EntityWrapper(props: Props) {
	// const { activeEntities } = React.useContext(EntitiesContext)
	// const { settings } = React.useContext(EntrySettingsContext)


	return (
		<Wrapper
			entity={props.entity}
			// settings={settings}
			// zIndexOffset={indexOfIterator(activeEntities, props.entity.id)}
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
			{/* <props.PopupBody
				entity={props.entity}
			/> */}
		</Wrapper>
	)
})
// Popup.defaultProps = {
// 	isPopup: false
// }
