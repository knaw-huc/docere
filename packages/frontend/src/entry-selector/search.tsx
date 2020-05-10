import * as React from 'react'
import styled from 'styled-components'
import HucFacetedSearch  from '@docere/search_'
import { TOP_OFFSET, UIComponentType, SearchTab } from '@docere/common'

import ProjectContext, { useUIComponent } from '../app/context'
import { FileExplorerProps } from './wrap-as-file-explorer'
import useAutoSuggest from './use-auto-suggest'

import type { Hit } from '@docere/common'

export const searchBaseUrl = '/search/'

const FS = styled(HucFacetedSearch)`
	background: white;
	box-sizing: border-box;
	height: calc(100vh - ${TOP_OFFSET}px);
	overflow-y: auto;
	overflow-x: hidden;
`

	// ${props => {
	// 	if (props.disableDefaultStyle) {
	// 		return `
	// 			display: grid;
	// 			grid-template-columns: calc(100vw - ${SEARCH_RESULT_ASIDE_WIDTH}px) ${SEARCH_RESULT_ASIDE_WIDTH}px;

	// 			& > aside {
	// 				max-height: 0;
	// 				overflow: hidden;
	// 			}

	// 			#huc-fs-active-filters {
	// 				display: none;
	// 			}

	// 			#huc-fs-header {
	// 				grid-template-columns: 0 1fr;
	// 				grid-template-rows: 0 48px;
	// 				padding-top: 0;
	// 				top: 0;

	// 				.right {
	// 					display: none;
	// 				}

	// 				.pagination {
	// 					margin-left: ${DEFAULT_SPACING}px;
	// 					width: 80px;

	// 					.pagenumbers {
	// 						& > div:not(.active) {
	// 							display: none;
	// 						}
	// 					}
	// 				}
	// 			}

	// 			#huc-fs-search-results {
	// 				padding: 0 ${DEFAULT_SPACING}px ${DEFAULT_SPACING * 2}px ${DEFAULT_SPACING}px;
	// 			}
	// 		`
	// 	}
	// }}

const excludeResultFields = ['text', 'text_suggest']

function Search(props: FileExplorerProps) {
	const { config } = React.useContext(ProjectContext)
	const autoSuggest = useAutoSuggest(config.slug)
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
			ResultBodyComponent={ResultBodyComponent}
			onClickResult={onClickResult}
			resultBodyProps={{
				activeId: props.entry == null ? null : props.entry.id,
				searchTab: props.searchTab,
			}}
			resultsPerPage={config.searchResultCount}
			small={props.searchTab === SearchTab.Results}
			url={`${searchBaseUrl}${config.slug}/_search`}
		/>
	)
}
			// disableDefaultStyle={props.searchTab === SearchTab.Results}

export default React.memo(Search)
