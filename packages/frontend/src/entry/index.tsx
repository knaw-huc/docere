import * as React from 'react'
import styled from 'styled-components'
import Panels from './panels'
import Aside from './aside'
import { Footer } from './footer'
import { ProjectUIContext } from '../project/ui-context'
import { Providers } from './context'

import { TOP_OFFSET, ASIDE_WIDTH, SEARCH_RESULT_ASIDE_WIDTH, FOOTER_HEIGHT, SearchTab, AsideTab, EntryTabContext } from '@docere/common'
import type { ProjectUIState } from '@docere/common'

interface MainProps {
	searchTab: ProjectUIState['searchTab']
	footerTab: ProjectUIState['footerTab']
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
	const { state } = React.useContext(ProjectUIContext)
	const { asideTab } = React.useContext(EntryTabContext)

	return (
		<Main
			asideTab={asideTab}
			id="entry-container"
			footerTab={state.footerTab}
			searchTab={state.searchTab}
		>
			{ props.children }
		</Main>
	)
}

function Entry() {
	return (
		<Providers>
			<Wrapper>
				<Panels/>
				<Aside/>
				<Footer/>
			</Wrapper>
		</Providers>
	)
}

export default React.memo(Entry)
