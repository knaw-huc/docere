import React from 'react'
import styled from 'styled-components'

import SortBy from './order-by'

import { FSResponse, SearchPropsContext, SetSortOrder, SortOrder } from '@docere/common'

const Wrapper = styled.div`
	grid-column: 1;
	grid-row: 2;
	height: 48px;
	line-height: 46px;
`

interface Props {
	currentPage: number
	searchHomeActive: boolean
	searchResult: FSResponse
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
export default function ResultCount(props: Props) {
	const { i18n, resultsPerPage } = React.useContext(SearchPropsContext)
	const [fromTo, setFromTo] = React.useState<[number, number]>([null, null])

	React.useEffect(() => {
		let nextFrom = (props.currentPage - 1) * resultsPerPage + 1
		if (nextFrom > props.searchResult.total) nextFrom = props.searchResult.total

		let nextTo = nextFrom + resultsPerPage - 1
		if (nextTo > props.searchResult.total) nextTo = props.searchResult.total

		setFromTo([nextFrom, nextTo])
	}, [props.currentPage, resultsPerPage, props.searchResult.total])

	if (props.searchHomeActive) {
		return (
			<Wrapper>
				{props.searchResult.total} {props.searchResult.total === 1 ? i18n.result : i18n.results}
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			{fromTo[0]}-{fromTo[1]} {i18n.of} {props.searchResult.total} {props.searchResult.total === 1 ? i18n.result : i18n.results},&nbsp;
			<SortBy
				setSortOrder={props.setSortOrder}
				sortOrder={props.sortOrder}
			/>
		</Wrapper>
	)
}
