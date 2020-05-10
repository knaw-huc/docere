import * as React from 'react'
import styled from 'styled-components'
import { TOP_OFFSET, ASIDE_HANDLE_WIDTH, SEARCH_RESULT_ASIDE_WIDTH, Viewport, SearchTab, TabPosition } from '@docere/common'

import Tabs from '../ui/tabs';
import { isSearchPage } from '../utils';
import Delayed from './delayed'

import type { AppState, AppStateAction } from '@docere/common'

type WProps = Pick<FileExplorerProps, 'searchTab' | 'viewport'>
const Wrapper = styled.div`
	bottom: 0;
	display: grid;
	grid-template-columns: ${props => props.searchTab === SearchTab.Results ? '600px' : '100vw'} ${ASIDE_HANDLE_WIDTH}px;
	pointer-events: none;
	position: fixed;
	top: ${TOP_OFFSET}px;
	transform: translateX(${props =>
		props.viewport === Viewport.EntrySelector || props.searchTab === SearchTab.Results ?
			0 :
			'-100vw'

	});
	transition: transform 300ms;
	width: ${(props: WProps) => props.searchTab === SearchTab.Results ?
		`${SEARCH_RESULT_ASIDE_WIDTH}px` :
		`calc(100vw + ${ASIDE_HANDLE_WIDTH}px)`
	};
	z-index: 6000;

	& > div, & > ul {
		pointer-events: all;
	}
`

export type FileExplorerProps = Pick<AppState, 'entry' | 'searchTab' | 'viewport'> & {
	appDispatch: React.Dispatch<AppStateAction>
}
export default function wrapAsFileExplorer(FileExplorer: React.FC<FileExplorerProps>) {
	return function FileExplorerWrapper(props: FileExplorerProps) {
		return (
			<Delayed condition={!isSearchPage()} milliseconds={2000}>
				<Wrapper
					searchTab={props.searchTab}
					viewport={props.viewport}
				>
					<FileExplorer {...props} />
					<Tabs
						onClick={(tab: SearchTab) => props.appDispatch({ type: 'SET_SEARCH_TAB', tab })}
						position={TabPosition.Left}
						tab={props.searchTab}
						tabs={[SearchTab.Search, SearchTab.Results]}
					/>
				</Wrapper>
			</Delayed>
		)
	}
}
