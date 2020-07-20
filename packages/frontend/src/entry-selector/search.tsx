import * as React from 'react'
import styled from 'styled-components'
import HucFacetedSearch  from '@docere/search'
import { ProjectContext, useUIComponent, UIComponentType, Viewport, Language } from '@docere/common'

import { FileExplorerProps } from './wrap-as-file-explorer'
import useAutoSuggest from './use-auto-suggest'

import type { Hit } from '@docere/common'
import { useHistory, useParams } from 'react-router-dom'

const FS = styled(HucFacetedSearch)`
	background: white;
	box-sizing: border-box;
	height: 100%;
	overflow-y: auto;
	overflow-x: hidden;
`

const excludeResultFields = ['text', 'text_suggest']

function Search(props: FileExplorerProps) {
	const history = useHistory()
	const { config, searchUrl } = React.useContext(ProjectContext)
	const autoSuggest = useAutoSuggest(searchUrl)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)
	const { entryId } = useParams()

	const onClickResult = React.useCallback((result: Hit) => {
		history.push(`/projects/${config.slug}/entries/${result.id}`)
	}, [])

	return (
		<FS
			autoSuggest={autoSuggest}
			excludeResultFields={excludeResultFields}
			language={Language.NL}
			onClickResult={onClickResult}
			ResultBodyComponent={ResultBodyComponent}
			resultBodyProps={{
				activeId: entryId,
				searchTab: props.searchTab,
			}}
			resultsPerPage={config.searchResultCount}
			small={props.viewport !== Viewport.EntrySelector}
			url={searchUrl}
		/>
	)
}

export default React.memo(Search)
