import * as React from "react"
import styled from "styled-components"
import { DEFAULT_POPUP_BG_COLOR, getTextPanelWidth } from '@docere/common'

import type { Note, Entity, DocereConfig } from '@docere/common'

interface P { offset: number }
const Wrapper = styled.div`
	margin-left: calc(50% - 160px + ${(p: P) => { return p.offset ? p.offset : 0}}px);
	margin-top: 1rem;
	opacity: ${p => p.offset == null ? 0 : 1};
	padding-bottom: 10vh;
	position: absolute;
	text-align: left;
	width: 320px;
	white-space: normal; ${/* Tooltip can be a child of a white-space wrapped element */''}
	z-index: 999;
`

export const TooltipBody = styled.div`
	background: white;
	border-color: ${(props: { color: string }) => props.color};
	border-radius: 6px;
	border-style: solid;
	border-width: 2px;
	box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
	box-sizing: border-box;
	color: #666;
	font-family: sans-serif;
	font-size: .85rem; ${/* Set font-size on TooltipBody, because it is also used when note is in the aside */''}
	font-weight: 300;
	height: 100%;
	line-height: 1.5rem;
`
TooltipBody.defaultProps = { color: DEFAULT_POPUP_BG_COLOR }

const Svg = styled.svg`
	left: calc(50% - ${(p: P) => p.offset}px - 10px);
	position: absolute;
	top: -19px;
`

// type Orientation = "top" | "right" | "bottom" | "left"
interface Props {
	activeNote: Note
	activeEntity: Entity
	bodyStyle?: React.CSSProperties
	children: React.ReactNode
	color?: string
	settings: DocereConfig['entrySettings']
}
function Tooltip(props: Props) {		
	const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
	const [offset, setOffset] = React.useState(null)

	React.useEffect(() => {
		let offset = 0

		const textPanelRect = wrapperRef.current.closest('.text-panel').getBoundingClientRect()
		const tooltipRect = wrapperRef.current.getBoundingClientRect()

		const textPanelLeft = textPanelRect.left + 32
		if (tooltipRect.left < textPanelLeft) offset = textPanelLeft - tooltipRect.left

		const textPanelMiddle = textPanelRect.left + (textPanelRect.width / 2)
		const textPanelRight = textPanelMiddle + (getTextPanelWidth(props.settings, props.activeNote, props.activeEntity) / 2) - 32
		if (tooltipRect.right > textPanelRight) offset = textPanelRight - tooltipRect.right

		setOffset(offset)
	}, [])

	return (
		<Wrapper
			offset={offset}
			ref={wrapperRef}
		>
			<TooltipBody
				color={props.color}
				style={props.bodyStyle}
			>
				{props.children}
			</TooltipBody>
			<Svg
				fill={props.color}
				height="20px"
				offset={offset}
				viewBox="0 0 30 30"
				width="20px"
			>
				<path d="M0,30 L15,12 L30,30" stroke={props.color} strokeWidth="3" />
				<polygon points="15,12 0,30 30,30 15,12"/>
			</Svg>
		</Wrapper>
	);
}

Tooltip.defaultProps = {
	bodyStyle: {},
	color: DEFAULT_POPUP_BG_COLOR,
	style: null,
} as Partial<Props>

export default Tooltip
