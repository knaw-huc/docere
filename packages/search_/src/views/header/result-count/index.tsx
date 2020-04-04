import React from 'react'
import styled from 'styled-components'

import FacetedSearchContext from '../../../context'
import SortBy from './order-by'

import type { FSResponse, FacetsData, SetSortOrder, SortOrder } from '@docere/common'

const Wrapper = styled.div`
	grid-column: 1;
	grid-row: 2;
	padding-left: 32px;
	height: 48px;
	line-height: 46px;
`

interface Props {
	currentPage: number
	facetsData: FacetsData
	searchResult: FSResponse
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
export default function ResultCount(props: Props) {
	const context = React.useContext(FacetedSearchContext)
	const [fromTo, setFromTo] = React.useState<[number, number]>([null, null])

	React.useEffect(() => {
		let nextFrom = (props.currentPage - 1) * context.resultsPerPage + 1
		if (nextFrom > props.searchResult.total) nextFrom = props.searchResult.total

		let nextTo = nextFrom + context.resultsPerPage - 1
		if (nextTo > props.searchResult.total) nextTo = props.searchResult.total

		setFromTo([nextFrom, nextTo])
	}, [props.currentPage, context.resultsPerPage, props.searchResult.total])

	return (
		<Wrapper>
			{fromTo[0]}-{fromTo[1]} of {props.searchResult.total} result{props.searchResult.total === 1 ? '' : 's'},&nbsp;
			<SortBy
				facetsData={props.facetsData}
				setSortOrder={props.setSortOrder}
				sortOrder={props.sortOrder}
			/>
		</Wrapper>
	)
}
