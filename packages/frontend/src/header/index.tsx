import * as React from 'react'
import styled from 'styled-components'
import { ProjectContext, TOP_OFFSET, DEFAULT_SPACING, Colors, getSearchPath, PagesMenu } from '@docere/common'
import { Link } from 'react-router-dom'

export const HEADER_DARK_TEXT = '#AAA'

const Wrapper = styled.header`
	background: ${Colors.GreyLight};
	box-sizing: border-box;
	height: ${TOP_OFFSET}px;
	position: sticky;
	top: 0;
	white-space: nowrap;
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

	& > a:first-of-type,
	& > small {
		font-weight: normal;
		font-size: 0.8rem;
		text-transform: none;
		margin-right: 0.66rem;
		color: ${HEADER_DARK_TEXT};
	}
`


interface HeaderProps {
	children: React.ReactNode
}
const Header = React.memo(function Header(props: HeaderProps) {
	return (
		<Wrapper>
			<TopMenu>
				{props.children}
			</TopMenu>
		</Wrapper>
	)
})

export function ProjectHeader() {
	const { config } = React.useContext(ProjectContext)

	return (
		<Header>
			<H1>
				<Link to="/">
					Docere
				</Link>
				<Link to={getSearchPath(config.slug)}>
					{config.title}
				</Link>
			</H1>
			<PagesMenu />
		</Header>
	)
}

interface HomeHeaderProps {
}
export function HomeHeader(_props: HomeHeaderProps) {
	return (
		<Header>
			<H1>
				<small>Docere</small>
			</H1>
		</Header>
	)
}
