import * as React from 'react'
import styled from '@emotion/styled'
import { MAINHEADER_HEIGHT, TOP_OFFSET, DEFAULT_SPACING, TOPMENU_HEIGHT, Viewport } from '@docere/common'
import PagesMenu from './pages'
import AppContext from '../app/context'

const Wrapper = styled.header`
	background: linear-gradient(to right, #988258, #c7aa71);
	box-sizing: border-box;
	display: grid;
	grid-template-rows: ${MAINHEADER_HEIGHT}px ${TOPMENU_HEIGHT}px;
	height: ${TOP_OFFSET}px;
	position: sticky;
	top: 0;
	z-index: 9999;

    background-image: url(/static/images/bg.jpg);
    background-position: bottom;
	background-size: 100% auto;
	box-shadow: 0 2px 3px black;
`

const TopMenu = styled.div`
	display: grid;
	grid-template-columns: 50% 50%;
	height: ${DEFAULT_SPACING}px;
	padding: 0 ${DEFAULT_SPACING}px;

	& > div {
		display: grid;
		grid-template-columns: 64px auto 28px;
	}
`

const H1 = styled('h1')`
	cursor: pointer;
	font-size: 1.25em;
	margin: 0;
	text-transform: uppercase;
	align-self: center;
    font-style: italic;
    color: white;
    text-shadow: 1px 1px 5px #404040;
	letter-spacing: .075em;
	line-height: ${TOP_OFFSET}px;

	a:hover, a:link, a:active, a:visited {
		color: inherit;
		text-decoration: none;
	}
`


interface Props {
	appDispatch: React.Dispatch<AppStateAction>
}
export default React.memo(function Header(props: Props) {
	const appContext = React.useContext(AppContext)
	const setSearchTab = React.useCallback(() =>
		props.appDispatch({ type: 'SET_VIEWPORT', viewport: Viewport.EntrySelector }),
	[])

	return (
		<Wrapper>
			<TopMenu>
				<H1
					onClick={setSearchTab}
				>
					{appContext.config.title}
				</H1>
				<PagesMenu
					appDispatch={props.appDispatch}
				/>
			</TopMenu>
		</Wrapper>
	)
})
