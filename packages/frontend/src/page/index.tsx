import React from 'react'
import styled from 'styled-components'
import DocereTextView from '../../../text/src'
import { TOP_OFFSET, DEFAULT_SPACING, ContainerType, useComponents, PageContext, DispatchContext } from '@docere/common'
import { ContainerProvider } from '../entry/panels/text/layer-provider'
import { useHistory } from 'react-router'
import { docereHistory } from '../app/history'

const Wrapper = styled.div`
	background: white;
	bottom: 0;
	color: #222;
	display: grid;
	font-family: Roboto, serif;
	font-size: 1.1rem;
	grid-template-columns: auto ${DEFAULT_SPACING * 20}px auto;
	left: 0;
	line-height: 2rem;
	overflow-y: auto;
	position: fixed;
	right: 0;
	top: ${TOP_OFFSET}px;
	z-index: 8000;

	& > div:first-of-type {
		grid-column: 2;
		padding-bottom: 33vh;
	}
`

const Close = styled.div`
	color: #666;
	cursor: pointer;
	font-size: 1.2em;
	position: fixed;
	right: ${DEFAULT_SPACING}px;
	top: ${DEFAULT_SPACING * 1.5}px;
`

// TODO useQuery is used to pass activeId to Page, but that should not be necessary

export default function PageView() {
	const dispatch = React.useContext(DispatchContext)
	const page = React.useContext(PageContext)
	const components = useComponents(ContainerType.Page, page?.id)
	const history = useHistory()

	const closePage = React.useCallback(() => {
		dispatch({ type: 'UNSET_PAGE' })
		history.push(docereHistory.getLastNonPage())
	}, [])

	if (page == null) return null

	return (
		<Wrapper id="page-container">
			<ContainerProvider id={page.id} type={ContainerType.Page}>
				<DocereTextView
					components={components}
					node={page.doc}
				/>
			</ContainerProvider>
			<Close onClick={closePage}>✕</Close>
		</Wrapper>
	)
}
