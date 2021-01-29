import React from "react"
import styled from "styled-components"
import { getTextPanelWidth, Entity, EntitiesContext, indexOfIterator, Colors } from '@docere/common'

import type { DocereConfig } from '@docere/common'

interface P { offset: number, zIndexOffset?: number }
const Wrapper = styled.div`
	margin-left: calc(50% - 160px + ${(p: P) => { return p.offset ? p.offset : 0}}px);
	margin-top: 1rem;
	opacity: ${p => p.offset == null ? 0 : 1};
	padding-bottom: 10vh;
	position: absolute;
	text-align: left;
	width: 320px;
	white-space: normal; ${/* Tooltip can be a child of a white-space wrapped element */''}
	z-index: ${p => p.zIndexOffset != null ? 999 + p.zIndexOffset : 999};
`

const TooltipBody = styled.div`
	background: white;
	border-color: ${(props: { entity: Entity, active?: boolean }) => props.entity.color};
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
TooltipBody.defaultProps = { color: Colors.Blue }

const Svg = styled.svg`
	left: calc(50% - ${(p: P) => p.offset}px - 10px);
	position: absolute;
	top: -19px;
`

// type Orientation = "top" | "right" | "bottom" | "left"
interface Props {
	children: React.ReactNode
	entity: Entity
	settings: DocereConfig['entrySettings']
	zIndexOffset?: number
}
function Tooltip(props: Props) {		
	const activeEntities = React.useContext(EntitiesContext)
	const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
	const [offset, setOffset] = React.useState(null)

	React.useEffect(() => {
		let offset = 0

		const textPanelRect = wrapperRef.current.closest('.text-panel').getBoundingClientRect()
		const tooltipRect = wrapperRef.current.getBoundingClientRect()

		const textPanelLeft = textPanelRect.left + 32
		if (tooltipRect.left < textPanelLeft) offset = textPanelLeft - tooltipRect.left

		const textPanelMiddle = textPanelRect.left + (textPanelRect.width / 2)
		const textPanelRight = textPanelMiddle + (getTextPanelWidth(props.settings, activeEntities) / 2) - 32
		if (tooltipRect.right > textPanelRight) offset = textPanelRight - tooltipRect.right

		setOffset(offset)
	}, [])

	return (
		<Wrapper
			offset={offset}
			ref={wrapperRef}
			zIndexOffset={indexOfIterator(activeEntities, props.entity.id)}
		>
			<TooltipBody
				entity={props.entity}
			>
				{props.children}
			</TooltipBody>
			<Svg
				fill={props.entity.color}
				height="20px"
				offset={offset}
				viewBox="0 0 30 30"
				width="20px"
			>
				<path d="M0,30 L15,12 L30,30" stroke={props.entity.color} strokeWidth="3" />
				<polygon points="15,12 0,30 30,30 15,12"/>
			</Svg>
		</Wrapper>
	)
}

export default Tooltip
