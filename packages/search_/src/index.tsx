import * as React from 'react'
import styled from 'styled-components'

import BooleanFacet from './views/facets/boolean'
import HierarchyFacet from './views/facets/hierarchy'
import DateFacet from './views/facets/date'
import ListFacet from './views/facets/list'
import RangeFacet from './views/facets/range'
import { isBooleanFacet, isListFacet, isRangeFacet, isDateFacet, isHierarchyFacet } from './constants'
import Header from './views/header'
import SearchResult from './views/search-result'
import FullTextSearch from './views/full-text-search'
import useFacetsDataReducer from './reducers/facets-data'
import useSearch from './use-search'
import { SortOrder } from '@docere/common'
import type { AppProps, ListFacetValues, BooleanFacetValues, HierarchyFacetValues, RangeFacetValues, ResultBodyProps } from '@docere/common'

const Wrapper = styled.div`
	margin-bottom: 10vh;

	${(props: { disableDefaultStyle: boolean}) => {
		if (!props.disableDefaultStyle) {
			return `
				display: grid;
				font-family: sans-serif;
				grid-template-columns: auto 300px minmax(320px, 672px) auto;
				grid-template-rows: 104px auto;
				grid-column-gap: 64px;

				& > #huc-full-text-search {
					grid-column: 2;
				}

				& > #huc-fs-header {
					grid-column: 3;
				}
				
				& > #huc-fs-facets {
					grid-column: 2;
					grid-row: 2;
					margin-top: 48px;
					margin-bottom: 10vh;
				}

				& > #huc-fs-search-results {
					grid-column: 3;
					grid-row: 2;
					margin-top: 48px;
					padding-left: 32px;
				}
			`
		}
	}}
`

function FacetedSearch(props: AppProps) {
	const [query, setQuery] = React.useState('')
	const [currentPage, setCurrentPage] = React.useState(1)
	const [sortOrder, setSortOrder] = React.useState<SortOrder>(new Map())
	const [facetsData, facetsDataDispatch] = useFacetsDataReducer(props.fields)
	const [searchResult, facetValues] = useSearch(props.url, {
		currentPage,
		excludeResultFields: props.excludeResultFields,
		facetsData,
		resultFields: props.resultFields,
		resultsPerPage: props.resultsPerPage,
		query,
		sortOrder,
		track_total_hits: props.track_total_hits
	})

	const clearActiveFilters = React.useCallback(() => {
		setQuery('')
		setSortOrder(new Map())
		facetsDataDispatch({ type: 'clear', fields: props.fields })
	}, [props.fields])

	const clearFullTextInput = React.useCallback(() => {
		setQuery('')
	}, [])

	if (facetsData == null) return null

	return (
		<Wrapper
			className={props.className}
			disableDefaultStyle={props.disableDefaultStyle}
			id="huc-fs"
		>
			<FullTextSearch
				autoSuggest={props.autoSuggest}
				setQuery={setQuery}
				query={query}
			/>
			<Header
				autoSuggest={props.autoSuggest}
				clearActiveFilters={clearActiveFilters}
				clearFullTextInput={clearFullTextInput}
				currentPage={currentPage}
				dispatch={facetsDataDispatch}
				facetsData={facetsData}
				searchResult={searchResult}
				query={query}
				resultsPerPage={props.resultsPerPage}
				setCurrentPage={setCurrentPage}
				setSortOrder={setSortOrder}
				sortOrder={sortOrder}
			/>
			<div id="huc-fs-facets">
				{
					Array.from(facetsData.values())
						.map(facetData => {
							const values = facetValues[facetData.id]

							if (isListFacet(facetData)) {
								return (
									<ListFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.id}
										values={values as ListFacetValues}
									/>
								)
							}
							else if (isBooleanFacet(facetData)) {
								return (
									<BooleanFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.id}
										values={values as BooleanFacetValues}
									/>
								)
							}
							else if (isHierarchyFacet(facetData)) {
								return (
									<HierarchyFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.id}
										values={values as HierarchyFacetValues}
									/>
								)
							}
							else if (isDateFacet(facetData)) {
								return (
									<DateFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.id}
										values={values as RangeFacetValues}
									/>
								)
							}
							else if (isRangeFacet(facetData)) {
								return (
									<RangeFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.id}
										values={values as RangeFacetValues}
									/>
								)
							}
							else {
								return null
							}
						})
				}
			</div>
			<SearchResult
				onClickResult={props.onClickResult}
				ResultBodyComponent={props.ResultBodyComponent}
				resultBodyProps={props.resultBodyProps}
				searchResult={searchResult}
			/>
		</Wrapper>
	)
}

FacetedSearch.defaultProps = {
	excludeResultFields: [],
	fields: [],
	resultFields: [],
	resultsPerPage: 10,
}

export default React.memo(FacetedSearch)
export type {
	ResultBodyProps
}
