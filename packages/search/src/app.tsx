import React from 'react'
import styled from 'styled-components'
import { SortOrder, DEFAULT_SPACING, SearchContext, SearchPropsContext } from '@docere/common'

import BooleanFacet from './views/facets/boolean'
import HierarchyFacet from './views/facets/hierarchy'
import ListFacet from './views/facets/list'
import RangeFacet from './views/facets/range'
import { isBooleanFacetData, isListFacetData, isRangeFacetData, isDateFacetData, isHierarchyFacetData } from './utils'
import Header from './views/header'
import SearchResult from './views/search-result'
import { FullTextSearch } from './views/full-text-search'
import { ToggleView } from './views/toggle-view'
import useSearch from './use-search'
import { ActiveFilters } from './views/header/active-filters'

import type { ListFacetValues, BooleanFacetValues, HierarchyFacetValues, RangeFacetValue } from '@docere/common'

const margin = DEFAULT_SPACING * 2

interface WProps { showResults: boolean, small: boolean }
const Wrapper = styled.div`
	display: grid;
	font-family: Roboto, sans-serif;
	grid-template-columns: ${(props: WProps) => 
		props.small ?
			`${margin}px calc(100% - 128px) ${margin}px calc(100% - 128px) ${margin}px;` :
			`minmax(${margin}px, auto) 300px ${margin}px minmax(480px, 640px) minmax(${margin}px, auto);`
	} 
	grid-template-rows: 104px auto;
	margin-bottom: 10vh;
	position: relative;

	& > #huc-fs-header,
	& > #huc-full-text-search {
		grid-row: 1;
	}

	& > #huc-full-text-search,
	& > #huc-fs-facets {
		grid-column: ${props => !props.small ? 2 : props.showResults ? -1 : 2};
	}

	& > #huc-fs-header,
	& > #huc-fs-search-results {
		grid-column: ${props => !props.small ? 4 : props.showResults ? 2 : -1};
	}
	
	& > #huc-fs-facets,
	& > #huc-fs-search-results {
		grid-row: 2;
	}

	& > #huc-fs-search-results {
		margin: 48px 0 10vh 0;
	}

	& > #huc-fs-facets {
		margin: 1.5rem 0 240px 0;
		width: 300px;
	}

	@media (max-width: 972px) {
		grid-template-columns: ${margin}px calc(100% - 128px) ${margin}px calc(100% - 128px) ${margin}px;

		& > #huc-full-text-search,
		& > #huc-fs-facets {
			grid-column: ${props => props.showResults ? -1 : 2};
		}

		& > #huc-fs-header,
		& > #huc-fs-search-results {
			grid-column: ${props => props.showResults ? 2 : -1};
		}
	}
`

export default function FacetedSearch() {
	const context = React.useContext(SearchPropsContext)
	const searchContext = React.useContext(SearchContext)
	const [showResults, setShowResults] = React.useState(true)
	const [currentPage, setCurrentPage] = React.useState(1)
	const [sortOrder, setSortOrder] = React.useState<SortOrder>(context.sortOrder)
	const [searchResult, facetValues] = useSearch({
		currentPage,
		facetsData: searchContext.state.facets,
		query: searchContext.state.query,
		sortOrder,
	})

	return (
		<Wrapper
			className={context.className}
			showResults={showResults}
			small={context.small}
			id="huc-fs"
		>
			<ToggleView
				showResults={showResults}
				setShowResults={setShowResults}
				small={context.small}
			/>
			<FullTextSearch />
			<Header
				currentPage={currentPage}
				searchResult={searchResult}
				setCurrentPage={setCurrentPage}
				setSortOrder={setSortOrder}
				sortOrder={sortOrder}
			/>
			{/* TODO move to Facets */}
			<div id="huc-fs-facets">
				<ActiveFilters />
				{/* <Button
					onClick={() => console.log('click')}
					spotColor={context.style.spotColor}
				>
					{context.i18n.collapseAll}
				</Button> */}
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
							else if (isRangeFacetData(facetData) || isDateFacetData(facetData)) {
								return (
									<RangeFacet
										facetData={facetData}
										key={facetData.config.id}
										values={values as RangeFacetValue[]}
									/>
								)
							}
							// else if (isRangeFacetData(facetData)) {
							// 	return (
							// 		<RangeFacet
							// 			facetData={facetData}
							// 			key={facetData.config.id}
							// 			values={values as RangeFacetValue[]}
							// 		/>
							// 	)
							// }
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
