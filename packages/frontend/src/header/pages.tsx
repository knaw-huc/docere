import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, MAINHEADER_HEIGHT, Colors, ProjectContext, DispatchContext } from '@docere/common'

import type { PageConfig } from '@docere/common'
// import { Link } from 'react-router-dom'

const Wrapper = styled.ul`
	align-self: center;
	height: ${MAINHEADER_HEIGHT}px;
	text-align: right;

	& > li {
		margin-right: ${DEFAULT_SPACING}px;

		&:last-of-type {
			margin-right: 0;
		}
	}

	li {
		color: #AAA;
		display: inline-block;
		font-size: .8rem;
		line-height: ${MAINHEADER_HEIGHT}px;
		position: relative;
		text-transform: lowercase;

		& > div:after {
			content: ' ▾';
			font-size: 1.25rem;
			line-height: 1rem;
			vertical-align: middle;
		}

		&:hover {
			color: #EEE;

			ul {
				display: block;
			}
		}

		ul {
			border-bottom-left-radius: 3px;
			border-bottom-right-radius: 3px;
			box-shadow: 1px 1px 2px #666;
			background-color: ${Colors.Grey};
			display: none;
			margin-top: -1px;
			padding: .5em 0;
			position: absolute;
			right: 0;

			li {
				display: block;
				font-size: .9rem;
				margin-right: 0;
				white-space: nowrap;
			}
		}
	}
`

const PageLink = styled.span`
	background: none;
	border: none;
	color: inherit;
	cursor: pointer;
	font-size: inherit;
	font-weight: normal;
	height: 100%;
	margin: 0 1em;
	outline: none;
	text-decoration: none;
	text-transform: inherit;

	&:hover {
		color: #EEE;
	}
`

type PageMenuItemProps = {
	pageConfig: PageConfig,
	setPage: (ev: React.MouseEvent<HTMLLIElement>) => void
}
function PageMenuItem(props: PageMenuItemProps) {
	return (
		<li
			data-page-id={props.pageConfig.id}
			onClick={props.setPage}
		>
			<PageLink>
				{props.pageConfig.title}
			</PageLink>
		</li>
	)
}

export default React.memo(function PagesMenu() {
	const { config } = React.useContext(ProjectContext)
	const dispatch = React.useContext(DispatchContext)

	const setPage = React.useCallback((ev: React.MouseEvent<HTMLLIElement>) => {
		dispatch({
			type: 'SET_PAGE_ID',
			setPage: {
				pageId: ev.currentTarget.dataset.pageId,
			}
		})
	}, [])

	return (
		<Wrapper>
			{
				config.pages.map(page =>
					page.hasOwnProperty('children') ?
						<li key={page.id}>
							<div>{page.title}</div>
							<ul>
								{
									page.children.map(child =>
										<PageMenuItem
											key={child.id}
											pageConfig={child}
											setPage={setPage}
										/>
									)
								}
							</ul>
						</li> :
						<PageMenuItem
							key={page.id}
							pageConfig={page}
							setPage={setPage}
						/>
				)
			}
		</Wrapper>
	)
})
