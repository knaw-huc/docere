import * as React from 'react'
import styled from 'styled-components'
import { isSearchPage, TOP_OFFSET, SEARCH_RESULT_ASIDE_WIDTH, Viewport, SearchTab, FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT, ProjectUIState } from '@docere/common'

import Delayed from './delayed'

import { ProjectUIContext } from '../project/ui-context'

type WProps = Pick<ProjectUIState, 'footerTab' | 'searchTab' | 'viewport'>
const Wrapper = styled.div`
	bottom: ${(props => 
		props.viewport === Viewport.EntrySelector ?
			0 : // When on search, stretch to the bottom
			props.footerTab != null ?
				FOOTER_HEIGHT + FOOTER_HANDLE_HEIGHT :
				FOOTER_HANDLE_HEIGHT)
	}px;
	pointer-events: none;
	position: fixed;
	top: ${TOP_OFFSET}px;
	transform: translateX(${props =>
		props.viewport === Viewport.EntrySelector || props.searchTab === SearchTab.Results ?
			0 :
			`-${SEARCH_RESULT_ASIDE_WIDTH}px`

	});
	transition: all 300ms;
	width: ${(props: WProps) => (props.searchTab === SearchTab.Results || props.viewport !== Viewport.EntrySelector) ?
		`${SEARCH_RESULT_ASIDE_WIDTH}px` :
		'100vw'
	};
	z-index: 6000;

	& > div, & > ul {
		pointer-events: all;
	}
`

// export type FileExplorerProps = Pick<ProjectState, 'footerTab' | 'searchTab' | 'viewport'> & {
// 	appDispatch: React.Dispatch<ProjectStateAction>
// }
export default function wrapAsFileExplorer(FileExplorer: React.FC<{}>) {
	return function FileExplorerWrapper() {
		const { state } = React.useContext(ProjectUIContext)

		return (
			<Delayed condition={!isSearchPage()} milliseconds={2000}>
				<Wrapper
					id="search-container"
					footerTab={state.footerTab}
					searchTab={state.searchTab}
					viewport={state.viewport}
				>
					<FileExplorer />
				</Wrapper>
			</Delayed>
		)
	}
}
