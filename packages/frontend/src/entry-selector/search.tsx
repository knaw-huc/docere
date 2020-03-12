import * as React from 'react'
import styled from '@emotion/styled'
import HucFacetedSearch  from '@docere/search'
import { DEFAULT_SPACING, TOP_OFFSET, RESULT_ASIDE_WIDTH, EsDataType, UIComponentType, defaultMetadata, SearchTab } from '@docere/common'
import { fetchJson } from '../utils'
import AppContext, { useUIComponent } from '../app/context'

const searchBaseUrl = '/search/'

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

const ignoreKeys = ['text', 'text_suggest', 'facsimiles', 'id']
function useFields(config: DocereConfig) {
	const [fields, setFields] = React.useState<FacetConfigBase[]>([])

	React.useEffect(() => {
		fetchJson(`${searchBaseUrl}${config.slug}/_mapping`)
			.then(json => {
				const { properties } = json[config.slug].mappings
				const tmpFields = Object.keys(properties)
					.filter(key => ignoreKeys.indexOf(key) === -1)
					.map(key => {
						let mdConfig = config.metadata.find(md => md.id === key)
						if (mdConfig == null) mdConfig = config.entities.find(td => td.id === key)
						if (mdConfig == null) mdConfig = {
							...defaultMetadata,
							id: key,
							title: key.charAt(0).toUpperCase() + key.slice(1)
						}
						return mdConfig
					})
					.filter(field => field.showAsFacet && field.datatype !== EsDataType.Null && field.datatype !== EsDataType.Text )
					.sort((f1, f2) => f1.order - f2.order)
				setFields(tmpFields)
			})
			.catch(err => console.log(err))
	}, [config.slug])
	
	return fields
}

function useAutoSuggest(projectId: string) {
	const url = `${searchBaseUrl}${projectId}/_search`
	return async function autoSuggest(query: string) {
		const r = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				suggest: {
					mysuggest: {
						text: query,
						completion: {
							field: 'text_suggest',
							size: 10,
							skip_duplicates: true,
						}
					}
				}
			})
		})

		const json = await r.json()
		return json.suggest.mysuggest[0].options
			.map((s: any) => s.text)
			.filter((item: string, index: number, arr: string[]) => arr.indexOf(item) === index)
	}
}

const excludeResultFields = ['text', 'text_suggest']

function Search(props: FileExplorerProps) {
	const appContext = React.useContext(AppContext)
	const autoSuggest = useAutoSuggest(appContext.config.slug)
	const fields = useFields(appContext.config)
	const ResultBodyComponent = useUIComponent(UIComponentType.SearchResult)
	if (ResultBodyComponent == null) return null

	return (
		<FS
			autoSuggest={autoSuggest}
			disableDefaultStyle={props.searchTab === SearchTab.Results}
			excludeResultFields={excludeResultFields}
			fields={fields}
			ResultBodyComponent={ResultBodyComponent}
			onClickResult={(result: Hit) => {
				if (result.snippets.length) {
					const query = result.snippets.reduce((prev, curr) => {
						const found = curr.split('<em>')
							.filter((t: string) => t.indexOf('</em>') > -1)
							.map((t: string) => t.slice(0, t.indexOf('</em>')))
						return prev.concat(found)

					}, [])

					props.appDispatch({ type: 'SET_SEARCH_QUERY', query })
				}
				props.appDispatch({ type: 'SET_ENTRY_ID', id: result.id })
			}}
			resultBodyProps={{
				activeId: props.entry == null ? null : props.entry.id,
				searchTab: props.searchTab,
			}}
			resultsPerPage={appContext.config.searchResultCount}
			track_total_hits={210000}
			url={`${searchBaseUrl}${appContext.config.slug}/_search`}
		/>
	)
}

export default React.memo(Search)
