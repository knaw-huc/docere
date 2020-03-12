import * as React from 'react'
import SortBy from './order-by'
import ActiveFilters from './active-filters'
import styled from '@emotion/styled'
import Pagination from './pagination'

const Wrapper = styled.header`
	align-items: center;
	background: white;
	border-bottom: 1px solid #EEE;
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: 24px 48px;
	grid-template-columns: 3fr 2fr;
	padding-top: 32px;
	position: sticky;
	top: -54px;

	& > #huc-fs-active-filters {
		grid-column: 1 / span 2;
		padding-left: 32px;
	}

	& > .right {
		grid-column: 1;
		grid-row: 2;
		padding-left: 32px;
		height: 48px;
		line-height: 46px;
	}

	& > .pagination {
		grid-column: 2;
		grid-row: 2;
	}
`

type Props = Pick<AppProps, 'resultsPerPage'> & {
	autoSuggest: AppProps['autoSuggest']
	clearActiveFilters: () => void
	clearFullTextInput: () => void
	currentPage: number
	dispatch: React.Dispatch<FacetsDataReducerAction>
	facetsData: FacetsData
	query: string
	searchResult: FSResponse
	setCurrentPage: (pageNumber: number) => void
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function Header(props: Props) {
	let from = (props.currentPage - 1) * props.resultsPerPage + 1
	if (from > props.searchResult.total) from = props.searchResult.total

	let to = from + props.resultsPerPage - 1
	if (to > props.searchResult.total) to = props.searchResult.total

	return (
		<Wrapper id="huc-fs-header">
			<ActiveFilters
				clearActiveFilters={props.clearActiveFilters}
				clearFullTextInput={props.clearFullTextInput}
				dispatch={props.dispatch}
				facetsData={props.facetsData}
				query={props.query}
			/>
			<div className="right">
				{from}-{to} of {props.searchResult.total} result{props.searchResult.total === 1 ? '' : 's'},&nbsp;
				<SortBy
					facetsData={props.facetsData}
					setSortOrder={props.setSortOrder}
					sortOrder={props.sortOrder}
				/>
			</div>
			<Pagination
				currentPage={props.currentPage}
				resultsPerPage={props.resultsPerPage}
				searchResults={props.searchResult}
				setCurrentPage={props.setCurrentPage}
			/>
		</Wrapper>
	)
}

export default React.memo(Header)
