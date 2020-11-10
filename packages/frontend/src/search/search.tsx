import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import HucFacetedSearch  from '@docere/search'
import { ProjectContext, useUIComponent, UIComponentType, Viewport, Language, getPath, useUrlObject } from '@docere/common'

import useAutoSuggest from './use-auto-suggest'

import type { Hit } from '@docere/common'
import { ProjectUIContext } from '../project/ui-context'

const FS = styled(HucFacetedSearch)`
	background: white;
	box-sizing: border-box;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
`

const excludeResultFields = ['text', 'text_suggest']

function Search() {
	const history = useHistory()
	const { config, searchUrl } = React.useContext(ProjectContext)
	const { state } = React.useContext(ProjectUIContext)
	const autoSuggest = useAutoSuggest(searchUrl)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)
	const { projectId, entryId } = useUrlObject()

	const onClickResult = React.useCallback((result: Hit) => {
		history.push(getPath({ projectId, entryId: result.id }))
	}, [projectId])

	return (
		<FS
			autoSuggest={autoSuggest}
			excludeResultFields={excludeResultFields}
			language={Language.NL}
			onClickResult={onClickResult}
			ResultBodyComponent={ResultBodyComponent}
			resultBodyProps={{
				activeId: entryId, //createElasticSearchIdFromIds(entryId, query?.partId),
				searchTab: state.searchTab,
			}}
			resultsPerPage={config.searchResultCount}
			small={state.viewport !== Viewport.EntrySelector}
			url={searchUrl}
		/>
	)
}

export default React.memo(Search)
