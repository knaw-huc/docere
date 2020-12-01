import * as React from 'react'
import styled from 'styled-components'
import { isSearchPage, TOP_OFFSET, SEARCH_RESULT_ASIDE_WIDTH, Viewport, SearchTab, FOOTER_HEIGHT, FOOTER_HANDLE_HEIGHT, UIContext } from '@docere/common'
import type { UIContextValue } from '@docere/common'

import FacetedSearch from './search'
import Delayed from './delayed'

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
	width: ${(props: UIContextValue) => (props.searchTab === SearchTab.Results || props.viewport !== Viewport.EntrySelector) ?
		`${SEARCH_RESULT_ASIDE_WIDTH}px` :
		'100vw'
	};
	z-index: 6000;

	& > div, & > ul {
		pointer-events: all;
	}
`

export default function Search() {
	const uiState = React.useContext(UIContext)

	return (
		<Delayed condition={!isSearchPage()} milliseconds={2000}>
			<Wrapper
				id="search-container"
				footerTab={uiState.footerTab}
				searchTab={uiState.searchTab}
				viewport={uiState.viewport}
			>
				<FacetedSearch />
			</Wrapper>
		</Delayed>
	)
}
