import * as React from 'react'
import styled from 'styled-components'
import { PageConfig } from '.'
import { ProjectContext, DispatchContext } from '..'
import { isUrlMenuItem, UrlMenuItem } from '../config'
import { DEFAULT_SPACING, MAINHEADER_HEIGHT } from '../constants'
import { Colors } from '../enum'


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

	a {
		color: inherit;
		text-decoration: none;
	}
`

type PageMenuItemProps = {
	pageConfig: PageConfig | UrlMenuItem,
	setPage: (ev: React.MouseEvent<HTMLLIElement>) => void
}
function PageMenuItem(props: PageMenuItemProps) {
	if (isUrlMenuItem(props.pageConfig)) {
		return (
			<li>
				<PageLink>
					<a href={props.pageConfig.url}>{props.pageConfig.title}</a>
				</PageLink>
			</li>
		)
	}

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

export const PagesMenu = React.memo(function() {
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

	if (config.pages?.config == null) return null

	return (
		<Wrapper className="pages-menu">
			{
				config.pages.config.map(page =>
					!isUrlMenuItem(page) && page.hasOwnProperty('children') ?
						<li key={page.title}>
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
							key={page.title}
							pageConfig={page}
							setPage={setPage}
						/>
				)
			}
		</Wrapper>
	)
})
