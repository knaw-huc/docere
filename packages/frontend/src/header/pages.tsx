import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, MAINHEADER_HEIGHT, Colors } from '@docere/common'
import type { PageConfig, AppStateAction } from '@docere/common'
import ProjectContext from '../app/context'

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

const Link = styled.button`
	background: none;
	border: none;
	color: inherit;
	cursor: pointer;
	font-size: inherit;
	font-weight: normal;
	height: 100%;
	outline: none;
	margin: 0 1em;
	text-transform: inherit;

	&:hover {
		color: #EEE;
	}
`

type PageMenuItemProps = { pageConfig: PageConfig } & Props
function PageMenuItem(props: PageMenuItemProps) {
	const setPage = React.useCallback(() => props.appDispatch({ type: "SET_PAGE_ID", id: props.pageConfig.id }), [props.pageConfig.id])
	return (
		<li>
			<Link
				onClick={setPage}
			>
				{props.pageConfig.title}
			</Link>
		</li>
	)
}

interface Props {
	appDispatch: React.Dispatch<AppStateAction>
}
export default React.memo(function PagesMenu(props: Props) {
	const { config } = React.useContext(ProjectContext)
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
											appDispatch={props.appDispatch}
											key={child.id}
											pageConfig={child}
										/>
									)
								}
							</ul>
							
						</li> :
						<PageMenuItem
							appDispatch={props.appDispatch}
							key={page.id}
							pageConfig={page}
						/>
				)
			}
		</Wrapper>
	)
})
