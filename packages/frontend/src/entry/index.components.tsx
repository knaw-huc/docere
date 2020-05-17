import * as React from 'react'
import styled, { css } from 'styled-components'
import { TOP_OFFSET, ASIDE_WIDTH, SEARCH_RESULT_ASIDE_WIDTH, FOOTER_HEIGHT, SearchTab } from '@docere/common'
import type { EntryState, AppState } from '@docere/common'

// interface MainProps { asideTab: AsideTab, footerTab: FooterTab, searchTab: SearchTab }
type MainProps = Pick<EntryState, 'asideTab'> & Pick<AppState, 'searchTab' | 'footerTab'>
export const Main = styled.div`
	bottom: ${(props: MainProps) => props.footerTab != null ? `${FOOTER_HEIGHT}px` : 0};
	left: ${props => props.searchTab === SearchTab.Results ? `${SEARCH_RESULT_ASIDE_WIDTH}px` : 0};
	position: fixed;
	right: ${props => props.asideTab != null ? `${ASIDE_WIDTH}px` : 0};
	top: ${TOP_OFFSET}px;
	transition: all 300ms;
`

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
