import React from 'react'
import DocereTextView from '@docere/text'
import styled from 'styled-components'
import { TEXT_PANEL_TEXT_WIDTH, DEFAULT_SPACING, getTextPanelLeftSpacing } from '@docere/common'

import Tooltip, { TooltipBody } from './tooltip'

import type { DocereComponentProps, DocereConfig } from '@docere/common'

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

const Body = styled.div`
	padding: 1rem;
`

interface Props {
	docereComponentProps: DocereComponentProps
	active: boolean
	color: string
	node?: Node | string
	openToAside: boolean
	PopupBody?: React.FC<DocereComponentProps>
	title: string
}
export function Popup(props: Props) {
	if (!props.active) return null
	const Wrapper = props.openToAside ?  PopupAsideWrapper : Tooltip

	return (
		<Wrapper
			activeEntity={props.docereComponentProps.activeEntity}
			activeNote={props.docereComponentProps.activeNote}
			color={props.color}
			settings={props.docereComponentProps.entrySettings}
		>
			{
				props.title != null &&
				<PopupHeader
					color={props.color}
				>
					<span></span>
					<span>{props.title}</span>
					<span></span>
				</PopupHeader>
			}
			{
				(props.node != null || props.PopupBody != null) ?
					props.node != null ?
						<Body>
							{
								typeof props.node === 'string' ?
									props.node :
									<DocereTextView 
										customProps={props.docereComponentProps}
										components={props.docereComponentProps.components}
										node={props.node}
									/>
							}
						</Body> :
						<props.PopupBody {...props.docereComponentProps} /> :
					null
			}
		</Wrapper>
	)
}
