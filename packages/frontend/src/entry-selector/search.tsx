import * as React from 'react'
import styled from 'styled-components'
import HucFacetedSearch  from '@docere/search_'
import { UIComponentType, Viewport, Language } from '@docere/common'

import ProjectContext, { useUIComponent } from '../app/context'
import { FileExplorerProps } from './wrap-as-file-explorer'
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

function Search(props: FileExplorerProps) {
	const { config, searchUrl } = React.useContext(ProjectContext)
	const autoSuggest = useAutoSuggest(searchUrl)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)

	const onClickResult = React.useCallback((result: Hit) => {
		// if (result.snippets.length) {
		// 	const query = result.snippets.reduce((prev, curr) => {
		// 		const found = curr.split('<em>')
		// 			.filter((t: string) => t.indexOf('</em>') > -1)
		// 			.map((t: string) => t.slice(0, t.indexOf('</em>')))
		// 		return prev.concat(found)

		// 	}, [])

		// 	searchFilterContext.dispatch({ type: 'SET_SEARCH_QUERY', query })
		// }
		props.appDispatch({ type: 'SET_ENTRY_ID', id: result.id })
	}, [])

	if (ResultBodyComponent == null) return null

	return (
		<FS
			autoSuggest={autoSuggest}
			excludeResultFields={excludeResultFields}
			language={Language.NL}
			onClickResult={onClickResult}
			ResultBodyComponent={ResultBodyComponent}
			resultBodyProps={{
				activeId: props.entry == null ? null : props.entry.id,
				searchTab: props.searchTab,
			}}
			resultsPerPage={config.searchResultCount}
			small={props.viewport !== Viewport.EntrySelector}
			url={searchUrl}
		/>
	)
}

export default React.memo(Search)
