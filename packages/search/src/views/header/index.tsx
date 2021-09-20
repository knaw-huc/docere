import React from 'react'
import styled from 'styled-components'

import Pagination from './pagination'
import ResultCount from './result-count'

import { FSResponse, SearchContext, SetSortOrder, SortOrder } from '@docere/common'

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
	currentPage: number
	searchResult: FSResponse
	setCurrentPage: (pageNumber: number) => void
	searchHomeActive: boolean
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function Header(props: Props) {
	return (
		<Wrapper id="huc-fs-header">
			<ResultCount
				currentPage={props.currentPage}
				searchHomeActive={props.searchHomeActive}
				searchResult={props.searchResult}
				setSortOrder={props.setSortOrder}
				sortOrder={props.sortOrder}
			/>

			{
				!props.searchHomeActive &&
				<Pagination
					currentPage={props.currentPage}
					searchResults={props.searchResult}
					setCurrentPage={props.setCurrentPage}
				/>
			}
		</Wrapper>
	)
}

export default React.memo(Header)
