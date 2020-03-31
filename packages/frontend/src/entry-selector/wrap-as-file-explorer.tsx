import * as React from 'react'
import styled from 'styled-components'
import { TOP_OFFSET, ASIDE_HANDLE_WIDTH, RESULT_ASIDE_WIDTH, Viewport, SearchTab, TabPosition } from '@docere/common'
import type { AppState, AppStateAction } from '@docere/common'
import Tabs from '../ui/tabs';

const Wrapper = styled.div`
	bottom: 0;
	display: grid;
	grid-template-columns: 100vw ${ASIDE_HANDLE_WIDTH}px;
	pointer-events: none;
	position: fixed;
	top: ${TOP_OFFSET}px;
	transform: translateX(${(props: Pick<FileExplorerProps, 'searchTab' | 'viewport'>) => {
		if (props.viewport === Viewport.EntrySelector) return 0
		if (props.viewport === Viewport.Entry) {
			return (props.searchTab === SearchTab.Results) ?
				`calc(-100vw + ${RESULT_ASIDE_WIDTH}px)` :
				'-100vw'
		}
	}});
	transition: transform 300ms;
	width: calc(100vw + ${ASIDE_HANDLE_WIDTH}px);
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
			<Wrapper
				searchTab={props.searchTab}
				viewport={props.viewport}
			>
				<FileExplorer {...props} />
				<Tabs
					// onClick={props.setSearchTab}
					onClick={(tab: SearchTab) => props.appDispatch({ type: 'SET_SEARCH_TAB', tab })}
					position={TabPosition.Left}
					tab={props.searchTab}
					tabs={[SearchTab.Search, SearchTab.Results]}
				/>
			</Wrapper>
		)
	}
}
