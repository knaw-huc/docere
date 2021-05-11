import React from "react"
import styled from "styled-components"

import { Colors } from '../enum'

interface P { offset: number, zIndexOffset?: number }
const Wrapper = styled.div`
	margin-left: calc(50% - 160px + ${(p: P) => { return p.offset ? p.offset : 0}}px);
	margin-top: .6rem;
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
	border-color: ${(props: { color: string }) => props.color};
	border-style: solid;
	border-width: 2px;
	box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
	box-sizing: border-box;
	color: #666;
	font-family: Roboto, sans-serif;
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

interface Props {
	color?: string
	children: React.ReactNode
	offset?: number
	zIndexOffset?: number
}
export const Tooltip = React.forwardRef((props: Props, ref: React.RefObject<HTMLDivElement>) =>
	<Wrapper
		offset={props.offset}
		ref={ref}
		zIndexOffset={props.zIndexOffset}
	>
		<TooltipBody
			color={props.color}
		>
			{props.children}
		</TooltipBody>
		<Svg
			fill={props.color}
			height="20px"
			offset={props.offset}
			viewBox="0 0 30 30"
			width="20px"
		>
			<path d="M0,30 L15,12 L30,30" stroke={props.color} strokeWidth="3" />
			<polygon points="15,12 0,30 30,30 15,12"/>
		</Svg>
	</Wrapper>
)

Tooltip.defaultProps = {
	color: '#00FFFF',
	offset: 0,
	zIndexOffset: 0,
}
