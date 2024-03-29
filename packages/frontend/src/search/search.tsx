import React from 'react'
import styled from 'styled-components'
import { ProjectContext, useUIComponent, UIComponentType, Viewport, Language, UIContext, EntryContext, DispatchContext, ContainerType, FacsimileContext } from '@docere/common'
import { GenericResultBody } from '@docere/ui-components'

import HucFacetedSearch  from '../../../search/src'
import useAutoSuggest from './use-auto-suggest'

import type { Hit } from '@docere/common'

const FS = styled(HucFacetedSearch)`
	background: white;
	box-sizing: border-box;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
`

const excludeResultFields = ['text', 'text_suggest']

function Search() {
	const { config, searchUrl } = React.useContext(ProjectContext)
	const uiState = React.useContext(UIContext)
	const autoSuggest = useAutoSuggest(searchUrl)
	const entry = React.useContext(EntryContext)
	const activeFacsimile = React.useContext(FacsimileContext)
	const dispatch = React.useContext(DispatchContext)

	let ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)
	if (ResultBodyComponent == null) ResultBodyComponent = GenericResultBody

	const onClickResult = React.useCallback((result: Hit) => {
		dispatch({
			type: 'SET_ENTRY_ID',
			setEntry: {
				entryId: result.id,
				triggerContainer: ContainerType.Search,
			}
		})
	}, [config.slug])

	return (
		<FS
			autoSuggest={autoSuggest}
			excludeResultFields={excludeResultFields}
			language={Language.EN}
			onClickResult={onClickResult}
			ResultBodyComponent={ResultBodyComponent}
			resultBodyProps={{
				activeId: entry?.id, //createElasticSearchIdFromIds(entryId, query?.partId),
				facsimile: activeFacsimile,
				searchTab: uiState.searchTab,
			}}
			resultsPerPage={config.searchResultCount}
			small={uiState.viewport !== Viewport.EntrySelector}
			url={searchUrl}
		/>
	)
}

export default React.memo(Search)
