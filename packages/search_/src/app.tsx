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
import useSearch from './use-search'
import Context from './context'

import type { ListFacetValues, BooleanFacetValues, HierarchyFacetValues, RangeFacetValues } from '@docere/common'
import SearchContext from './facets-context'

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
	const searchContext = React.useContext(SearchContext)
	const [currentPage, setCurrentPage] = React.useState(1)
	const [sortOrder, setSortOrder] = React.useState<SortOrder>(new Map())
	const [searchResult, facetValues] = useSearch({
		currentPage,
		facetsData: searchContext.state.facets,
		query: searchContext.state.query,
		sortOrder,
	})

	return (
		<Wrapper
			className={context.className}
			disableDefaultStyle={context.disableDefaultStyle}
			id="huc-fs"
		>
			<FullTextSearch />
			<Header
				currentPage={currentPage}
				searchResult={searchResult}
				setCurrentPage={setCurrentPage}
				setSortOrder={setSortOrder}
				sortOrder={sortOrder}
			/>
			<div id="huc-fs-facets">
				{
					Array.from(searchContext.state.facets.values())
						.map(facetData => {
							const values = facetValues[facetData.config.id]

							if (isListFacetData(facetData)) {
								return (
									<ListFacet
										facetData={facetData}
										key={facetData.config.id}
										values={values as ListFacetValues}
									/>
								)
							}
							else if (isBooleanFacetData(facetData)) {
								return (
									<BooleanFacet
										facetData={facetData}
										key={facetData.config.id}
										values={values as BooleanFacetValues}
									/>
								)
							}
							else if (isHierarchyFacetData(facetData)) {
								return (
									<HierarchyFacet
										facetData={facetData}
										key={facetData.config.id}
										values={values as HierarchyFacetValues}
									/>
								)
							}
							else if (isDateFacetData(facetData)) {
								return (
									<DateFacet
										facetData={facetData}
										key={facetData.config.id}
										values={values as RangeFacetValues}
									/>
								)
							}
							else if (isRangeFacetData(facetData)) {
								return (
									<RangeFacet
										facetData={facetData}
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
