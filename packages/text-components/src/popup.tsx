import React from 'react'
import DocereTextView from '@docere/text'
import Tooltip, { TooltipBody } from './tooltip'
import styled from 'styled-components'
import { DEFAULT_POPUP_BG_COLOR, TEXT_PANEL_GUTTER_WIDTH, TEXT_PANEL_TEXT_WIDTH, DEFAULT_SPACING } from '@docere/common'

const PopupAsideWrapper = styled(TooltipBody)`
	backgroundColor: white;
	height: auto;
	left: ${TEXT_PANEL_GUTTER_WIDTH + TEXT_PANEL_TEXT_WIDTH + DEFAULT_SPACING}px;
	margin-bottom: 5rem;
	margin-top: -1.8rem;
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
	font-size: .8rem;
	grid-template-columns: 1fr 8fr 1fr;
	justify-items: center;
	line-height: .8rem;
	padding: .5rem 1rem;
	
	& + div {
		padding: 1rem;
	}
`
PopupHeader.defaultProps = { color: DEFAULT_POPUP_BG_COLOR }

interface Props {
	docereComponentProps: DocereComponentProps
	active: boolean
	color?: string
	node: Node
	title: string
}
export default function Popup(props: Props) {
	if (!props.active) return null
	const Wrapper = props.docereComponentProps.layer.asideActive ?  PopupAsideWrapper : Tooltip

	return (
		<Wrapper
			color={props.color}
		>
			<PopupHeader
				color={props.color}
			>
				{
					props.docereComponentProps.layer.asideActive ?
						<span
							onClick={ev => {
								ev.stopPropagation()
								props.docereComponentProps.entryDispatch({ type: 'TOGGLE_TEXT_LAYER_ASIDE', id: props.docereComponentProps.layer.id })
							}}
						>{`<<`}</span> :
						<span />
				}
				<span>{props.title}</span>
				{
					!props.docereComponentProps.layer.asideActive ?
						<span
							onClick={ev => {
								ev.stopPropagation()
								props.docereComponentProps.entryDispatch({ type: 'TOGGLE_TEXT_LAYER_ASIDE', id: props.docereComponentProps.layer.id })
							}}
						>{`>>`}</span> :
						<span />
				}
			</PopupHeader>
			<DocereTextView 
				customProps={props.docereComponentProps}
				components={props.docereComponentProps.components}
				node={props.node}
			/>
		</Wrapper>
	)
}
