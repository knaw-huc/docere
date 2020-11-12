import * as React from 'react'
import styled, { css } from 'styled-components'

// interface MainProps { asideTab: AsideTab, footerTab: FooterTab, searchTab: SearchTab }

export const Menu = styled.div`
	background-color: white;
	border-bottom: 1px solid #CCC;
	display: grid;
	grid-template-columns: 1fr 1fr;
	height: 64px;
	position: sticky;
	top: 0;
	z-index: 1;

	& > div {
		align-items: center;
		display: grid;
		grid-template-columns: repeat(auto-fill, 48px);
		justify-items: center;
	}

	& > div:first-of-type {
	}

	& > div:last-of-type {
		direction: rtl;
	}
`

export const small = css`
	color: #444;
	font-size: .8em;
	margin-left: .5em;
`

interface ButtonProps {
	children: any
	onClick: () => void
	title: string
}
export const SVGButton = React.memo(function(props: ButtonProps) {
	return (
		<svg
			onClick={props.onClick}
			style={{ cursor: 'pointer' }}
			viewBox="0 0 40 30"
			width="24px"
		>
			<title>{props.title}</title>
			<g fill="#444" stroke="#444">
				{props.children}
			</g>
		</svg>
	)
})
