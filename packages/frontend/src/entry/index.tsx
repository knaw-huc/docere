import * as React from 'react'
import styled from 'styled-components'
import Panels from './panels'
import Aside from './aside'
import { Footer } from './footer'

import { TOP_OFFSET, ASIDE_WIDTH, SEARCH_RESULT_ASIDE_WIDTH, FOOTER_HEIGHT, SearchTab, AsideTab, AsideTabContext, UIContext, EntryContext } from '@docere/common'
import type { UIContextValue } from '@docere/common'

interface MainProps {
	searchTab: UIContextValue['searchTab']
	footerTab: UIContextValue['footerTab']
	asideTab: AsideTab
}
const Main = styled.div`
	bottom: ${(props: MainProps) => props.footerTab != null ? `${FOOTER_HEIGHT}px` : 0};
	left: ${props => props.searchTab === SearchTab.Results ? `${SEARCH_RESULT_ASIDE_WIDTH}px` : 0};
	position: fixed;
	right: ${props => props.asideTab != null ? `${ASIDE_WIDTH}px` : 0};
	top: ${TOP_OFFSET}px;
	transition: all 300ms;
`
function Wrapper(props: { children: React.ReactNode }) {
	const uiState = React.useContext(UIContext)
	const asideTab = React.useContext(AsideTabContext)

	return (
		<Main
			asideTab={asideTab}
			id="entry-container"
			footerTab={uiState.footerTab}
			searchTab={uiState.searchTab}
		>
			{ props.children }
		</Main>
	)
}

export default React.memo(function Entry() {
	const entry = React.useContext(EntryContext)
	if (entry == null) return null /** Prevent render if entry does not exist */

	return (
		<Wrapper>
			<Panels/>
			<Aside/>
			<Footer/>
		</Wrapper>
	)
})
