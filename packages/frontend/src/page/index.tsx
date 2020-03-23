import * as React from 'react'
import styled from '@emotion/styled'
import DocereTextView from '@docere/text_'
import { TOP_OFFSET, DEFAULT_SPACING, DocereComponentContainer } from '@docere/common'
import { useComponents } from '../app/context'

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
	& > div:last-of-type {
		grid-column: 4;
	}
`

const Close = styled.div`
	align-content: center;
	color: #666;
	cursor: pointer;
	display: grid;
	font-size: 1.2em;
	height: 1em;
	justify-content: center;
	position: sticky;
	top: ${DEFAULT_SPACING}px;
`

interface Props {
	appDispatch: React.Dispatch<AppStateAction>
	page: Page
}
export default React.memo(function PageView(props: Props) {
	if (props.page == null) return null
	const components = useComponents(DocereComponentContainer.Page)
	const setPage = React.useCallback(() => props.appDispatch({ type: 'UNSET_PAGE' }), [])

	return (
		<Wrapper>
			<DocereTextView
				components={components}
				node={props.page.doc}
			/>
			<Close onClick={setPage}>✕</Close>
		</Wrapper>
	)
})
