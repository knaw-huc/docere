import * as React from 'react'
import styled from '@emotion/styled'
import { DEFAULT_SPACING } from '@docere/common'
import AppContext from '../app/context'

const Wrapper = styled.ul`
	text-align: right;
	align-self: center;

	& > li {
		padding-bottom: .8em;
	}

	li {
		display: inline-block;
		margin-right: ${DEFAULT_SPACING}px;
		color: #444;
		font-size: .8rem;
		position: relative;
		text-transform: lowercase;

		&:hover {
			ul {
				display: block;
			}
		}

		ul {
			border-radius: 3px;
			box-shadow: 1px 1px 2px #666;
			background-color: #ead6ad;
			display: none;
			margin-top: .8em;
			padding-bottom: .5em;
			position: absolute;
			right: 0;

			li {
				display: block;
				margin-right: 0;
				white-space: nowrap;
			}
		}
	}
`

const Link = styled.button`
	background: none;
	border: none;
	border-bottom: 1px solid rgba(0, 0, 0, 0);
	color: inherit;
	cursor: pointer;
	font-size: inherit;
	outline: none;
	padding: .8em 0 .2em 0;
	margin: 0 1em;
	text-transform: inherit;

	&:hover {
		border-bottom: 1px solid #666;
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
	const appContext = React.useContext(AppContext)
	return (
		<Wrapper>
			{
				appContext.config.pages.map(page =>
					page.hasOwnProperty('children') ?
						<li key={page.id}>
							<span>{page.title} ▾</span>
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
