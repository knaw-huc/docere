import * as React from 'react'
import styled from 'styled-components'
import { TOP_OFFSET, DEFAULT_SPACING, Viewport, Colors } from '@docere/common'
import type { AppStateAction } from '@docere/common'
import PagesMenu from './pages'
import ProjectContext from '../app/context'

const Wrapper = styled.header`
	background: ${Colors.GreyLight};
	box-sizing: border-box;
	height: ${TOP_OFFSET}px;
	position: sticky;
	top: 0;
	z-index: 9999;
`

const TopMenu = styled.div`
	display: grid;
	grid-template-columns: 50% 50%;
	padding: 0 ${DEFAULT_SPACING}px;

	& > div {
		display: grid;
		grid-template-columns: 64px auto 28px;
	}
`

const H1 = styled('h1')`
	cursor: pointer;
	font-size: .9rem;
	margin: 0;
	text-transform: uppercase;
	align-self: center;
    color: white;
    text-shadow: 1px 1px 5px #404040;
	letter-spacing: .075em;
	line-height: ${TOP_OFFSET}px;

	a:hover, a:link, a:active, a:visited {
		color: inherit;
		text-decoration: none;
	}

	small {
		font-weight: normal;
		font-size: 0.8rem;
		text-transform: none;
		margin-right: 0.66rem;
		color: #aaa;
	}
`


interface Props {
	appDispatch: React.Dispatch<AppStateAction>
}
export default React.memo(function Header(props: Props) {
	const { config } = React.useContext(ProjectContext)
	const setSearchTab = React.useCallback(() =>
		props.appDispatch({ type: 'SET_VIEWPORT', viewport: Viewport.EntrySelector }),
	[])

	return (
		<Wrapper>
			<TopMenu>
				<H1
					onClick={setSearchTab}
				>
					<small>Docere</small>
					{config.title}
				</H1>
				<PagesMenu
					appDispatch={props.appDispatch}
				/>
			</TopMenu>
		</Wrapper>
	)
})
