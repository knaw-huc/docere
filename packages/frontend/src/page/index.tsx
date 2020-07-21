import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DocereTextView from '@docere/text'
import { TOP_OFFSET, DEFAULT_SPACING, DocereComponentContainer, useComponents, usePage, getSearchPath, PageComponentProps, useUrlObject } from '@docere/common'

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

const Close = styled(Link)`
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
	const { projectId, pageId, query } = useUrlObject()
	const page = usePage(pageId)
	const components = useComponents(DocereComponentContainer.Page, pageId)

	if (page == null) return null

	const customProps: PageComponentProps = {
		activeId: null,
		...query,
	}

	return (
		<Wrapper id="page-container">
			<DocereTextView
				customProps={customProps}
				components={components}
				node={page.doc}
			/>
			<Close to={getSearchPath({ projectId })}>✕</Close>
		</Wrapper>
	)
}
