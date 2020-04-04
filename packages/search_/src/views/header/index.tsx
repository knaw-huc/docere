import React from 'react'
import styled from 'styled-components'

import ActiveFilters from './active-filters'
import Pagination from './pagination'
import ResultCount from './result-count'

import type { FacetsDataReducerAction, FacetsData, FSResponse, SetSortOrder, SortOrder } from '@docere/common'
// import type { AppProps } from '../..'
// import type { FacetsData } from '../../types/facets'
// import type { FSResponse, SetSortOrder, SortOrder } from '../../types'
// import type { FacetsDataReducerAction } from '../../reducers/facets-data.action'

const Wrapper = styled.header`
	align-items: center;
	background: white;
	border-bottom: 2px solid #CCC;
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-rows: 24px 48px;
	grid-template-columns: 3fr 2fr;
	padding-top: 32px;
	position: sticky;
	top: -54px;
`

interface Props {
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
	return (
		<Wrapper id="huc-fs-header">
			<ActiveFilters
				clearActiveFilters={props.clearActiveFilters}
				clearFullTextInput={props.clearFullTextInput}
				dispatch={props.dispatch}
				facetsData={props.facetsData}
				query={props.query}
			/>
			<ResultCount
				currentPage={props.currentPage}
				facetsData={props.facetsData}
				searchResult={props.searchResult}
				setSortOrder={props.setSortOrder}
				sortOrder={props.sortOrder}
			/>
			<Pagination
				currentPage={props.currentPage}
				searchResults={props.searchResult}
				setCurrentPage={props.setCurrentPage}
			/>
		</Wrapper>
	)
}

export default React.memo(Header)
