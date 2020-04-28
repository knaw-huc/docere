import * as React from 'react'
import styled from 'styled-components'
import HucFacetedSearch  from '@docere/search_'
import { DEFAULT_SPACING, TOP_OFFSET, RESULT_ASIDE_WIDTH, UIComponentType, SearchTab } from '@docere/common'

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
	width: 100vw;

	${props => {
		if (props.disableDefaultStyle) {
			return `
				display: grid;
				grid-template-columns: calc(100vw - ${RESULT_ASIDE_WIDTH}px) ${RESULT_ASIDE_WIDTH}px;

				& > aside {
					max-height: 0;
					overflow: hidden;
				}

				#huc-fs-active-filters {
					display: none;
				}

				#huc-fs-header {
					grid-template-columns: 0 1fr;
					grid-template-rows: 0 48px;
					padding-top: 0;
					top: 0;

					.right {
						display: none;
					}

					.pagination {
						margin-left: 32px;
						width: 80px;

						.pagenumbers {
							& > div:not(.active) {
								display: none;
							}
						}
					}
				}

				#huc-fs-search-results {
					padding: 0 ${DEFAULT_SPACING}px ${DEFAULT_SPACING * 2}px ${DEFAULT_SPACING}px;
				}
			`
		}
	}}
`

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
			disableDefaultStyle={props.searchTab === SearchTab.Results}
			excludeResultFields={excludeResultFields}
			// facetsConfig={facetsConfig}
			ResultBodyComponent={ResultBodyComponent}
			// onFiltersChange={handleFiltersChange}
			onClickResult={onClickResult}
			resultBodyProps={{
				activeId: props.entry == null ? null : props.entry.id,
				searchTab: props.searchTab,
			}}
			resultsPerPage={config.searchResultCount}
			url={`${searchBaseUrl}${config.slug}/_search`}
		/>
	)
}

export default React.memo(Search)
