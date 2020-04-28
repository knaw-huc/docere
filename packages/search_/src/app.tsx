import React from 'react'
import styled from 'styled-components'
import { SortOrder } from '@docere/common'

import BooleanFacet from './views/facets/boolean'
import HierarchyFacet from './views/facets/hierarchy'
import DateFacet from './views/facets/date'
import ListFacet from './views/facets/list'
import RangeFacet from './views/facets/range'
import { isBooleanFacetData, isListFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from './utils'
import Header from './views/header'
import SearchResult from './views/search-result'
import FullTextSearch from './views/full-text-search'
import useFacetsDataReducer from './reducers/facets-data'
import useSearch from './use-search'
import Context from './context'

import type { FacetedSearchContext, ListFacetValues, BooleanFacetValues, HierarchyFacetValues, RangeFacetValues } from '@docere/common'

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

export default function FacetedSearch() {
	const context = React.useContext(Context)
	const [query, setQuery] = React.useState('')
	const [currentPage, setCurrentPage] = React.useState(1)
	const [sortOrder, setSortOrder] = React.useState<SortOrder>(new Map())
	const [facetsData, facetsDataDispatch] = useFacetsDataReducer(context.facetsConfig, context.activeFilters)
	const [searchResult, facetValues] = useSearch({
		currentPage,
		facetsData,
		query,
		sortOrder,
	})

	const clearActiveFilters = React.useCallback(() => {
		setQuery('')
		setSortOrder(new Map())
		facetsDataDispatch({ type: 'clear', fields: context.facetsConfig, activeFilters: {} })
	}, [context.facetsConfig])

	const clearFullTextInput = React.useCallback(() => {
		setQuery('')
	}, [])

	React.useEffect(() => {
		if (facetsData == null || !facetsData.size) return
		const activeFilters = Array.from(facetsData.values()).reduce((prev, curr) => {
			if (curr.filters != null) prev[curr.config.id] = curr.filters
			return prev	
		}, {} as FacetedSearchContext['activeFilters'])

		context.onFiltersChange(activeFilters)
	}, [facetsData])

	React.useEffect(() => {
		setQuery('')
		setSortOrder(new Map())
		facetsDataDispatch({ type: 'clear', fields: context.facetsConfig, activeFilters: context.activeFilters })
	}, [context.activeFilters])

	if (facetsData == null) return null

	return (
		<Wrapper
			className={context.className}
			disableDefaultStyle={context.disableDefaultStyle}
			id="huc-fs"
		>
			<FullTextSearch
				setQuery={setQuery}
				query={query}
			/>
			<Header
				clearActiveFilters={clearActiveFilters}
				clearFullTextInput={clearFullTextInput}
				currentPage={currentPage}
				dispatch={facetsDataDispatch}
				facetsData={facetsData}
				searchResult={searchResult}
				query={query}
				setCurrentPage={setCurrentPage}
				setSortOrder={setSortOrder}
				sortOrder={sortOrder}
			/>
			<div id="huc-fs-facets">
				{
					Array.from(facetsData.values())
						.map(facetData => {
							const values = facetValues[facetData.config.id]

							if (isListFacetData(facetData)) {
								return (
									<ListFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.config.id}
										values={values as ListFacetValues}
									/>
								)
							}
							else if (isBooleanFacetData(facetData)) {
								return (
									<BooleanFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.config.id}
										values={values as BooleanFacetValues}
									/>
								)
							}
							else if (isHierarchyFacetData(facetData)) {
								return (
									<HierarchyFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.config.id}
										values={values as HierarchyFacetValues}
									/>
								)
							}
							else if (isDateFacetData(facetData)) {
								return (
									<DateFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.config.id}
										values={values as RangeFacetValues}
									/>
								)
							}
							else if (isRangeFacetData(facetData)) {
								return (
									<RangeFacet
										facetData={facetData}
										facetsDataDispatch={facetsDataDispatch}
										key={facetData.config.id}
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
				searchResult={searchResult}
			/>
		</Wrapper>
	)
}
