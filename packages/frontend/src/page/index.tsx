import React from 'react'
import styled from 'styled-components'
import DocereTextView from '@docere/text'
import { TOP_OFFSET, DEFAULT_SPACING, DocereComponentContainer, useComponents, PageContext, DispatchContext } from '@docere/common'

const Wrapper = styled.div`
	background: white;
	bottom: 0;
	color: #222;
	display: grid;
	font-family: serif;
	font-size: 1.1rem;
	grid-template-columns: auto ${DEFAULT_SPACING * 20}px auto ${DEFAULT_SPACING * 2}px;
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
	align-content: center;
	color: #666;
	cursor: pointer;
	display: grid;
	font-size: 1.2em;
	grid-column: 4;
	height: 1em;
	justify-content: center;
	position: sticky;
	top: ${DEFAULT_SPACING}px;
`

// TODO useQuery is used to pass activeId to Page, but that should not be necessary

export default function PageView() {
	const dispatch = React.useContext(DispatchContext)
	const page = React.useContext(PageContext)
	const components = useComponents(DocereComponentContainer.Page, page?.id)

	const closePage = React.useCallback(() => dispatch({ type: 'UNSET_PAGE' }), [])

	if (page == null) return null

	return (
		<Wrapper id="page-container">
			<DocereTextView
				components={components}
				node={page.doc}
			/>
			<Close onClick={closePage}>✕</Close>
		</Wrapper>
	)
}
