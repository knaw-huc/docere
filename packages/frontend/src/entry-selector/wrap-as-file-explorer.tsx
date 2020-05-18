import * as React from 'react'
import styled from 'styled-components'
import { TOP_OFFSET, SEARCH_RESULT_ASIDE_WIDTH, Viewport, SearchTab, FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT } from '@docere/common'

import { isSearchPage } from '../utils';
import Delayed from './delayed'

import type { AppState, AppStateAction } from '@docere/common'

type WProps = Pick<FileExplorerProps, 'footerTab' | 'searchTab' | 'viewport'>
const Wrapper = styled.div`
	bottom: ${(props => props.footerTab != null ? FOOTER_HEIGHT + FOOTER_HANDLE_HEIGHT : FOOTER_HANDLE_HEIGHT)}px;
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

export type FileExplorerProps = Pick<AppState, 'entry' | 'footerTab' | 'searchTab' | 'viewport'> & {
	appDispatch: React.Dispatch<AppStateAction>
}
export default function wrapAsFileExplorer(FileExplorer: React.FC<FileExplorerProps>) {
	return function FileExplorerWrapper(props: FileExplorerProps) {
		return (
			<Delayed condition={!isSearchPage()} milliseconds={2000}>
				<Wrapper
					footerTab={props.footerTab}
					searchTab={props.searchTab}
					viewport={props.viewport}
				>
					<FileExplorer {...props} />
					{/* <Tabs
						onClick={(tab: SearchTab) => props.appDispatch({ type: 'SET_SEARCH_TAB', tab })}
						position={TabPosition.Left}
						tab={props.searchTab}
						tabs={[SearchTab.Search, SearchTab.Results]}
					/> */}
				</Wrapper>
			</Delayed>
		)
	}
}
