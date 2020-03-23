import * as React from 'react'
import styled from '@emotion/styled'
import { Input } from '../../full-text-search'
import debounce from 'lodash.debounce'
import { SortDirection, SortBy } from '../../../constants'


const Wrapper = styled('div')`
	font-size: .9em;
	margin-bottom: 2em;
`

const RadioGroup = styled('div')`
	border: 1px solid #AAA;
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 1em;
`

const Div = styled('div')`
	list-style: none;
	display: grid;
	grid-template-columns: 24px 1fr;
	grid-template-rows: 1fr 1fr;
`

const H4 = styled('h4')`
	color: gray;
	font-weight: normal;
	margin: 1em 0 .2em 0;
	padding: 0;
`

const FilterInput = styled(Input)`
	border: 1px solid #AAA;
	height: 2em;
	width: 100%;
`

function Options(props: ListFacetProps) {
	const [filterInputValue, setFilterInputValue] = React.useState('')

	const handleHighestFirstChange = React.useCallback(
		() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: SortBy.Count, direction: SortDirection.Desc }),
		[props.facetData.id]
	)

	const handleLowestFirstChange = React.useCallback(
		() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: SortBy.Count, direction: SortDirection.Asc }),
		[props.facetData.id]
	)

	const handleZaChange = React.useCallback(
		() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: SortBy.Key, direction: SortDirection.Desc }),
		[props.facetData.id]
	)

	const handleAzChange = React.useCallback(
		() => props.facetsDataDispatch({ type: 'set_sort', facetId: props.facetData.id, by: SortBy.Key, direction: SortDirection.Asc }),
		[props.facetData.id]
	)

	const setQuery = debounce((value: string) => props.facetsDataDispatch({ type: 'set_query', facetId: props.facetData.id, value }), 600)
	const handleFilterInputChange = React.useCallback(
		(ev: React.ChangeEvent<HTMLInputElement>) => {
			setFilterInputValue(ev.target.value)
			setQuery(ev.target.value)
		},
		[]
	)

	return (
		<Wrapper>
			<H4>Order</H4>
			<RadioGroup>
				<Div>
					<input
						defaultChecked
						id="highest-first-radio"
						name="sort"
						onChange={handleHighestFirstChange}
						type="radio"
					/>
					<label htmlFor="highest-first-radio">Highest first</label>
					<input
						id="lowest-first-radio"
						type="radio"
						name="sort"
						onChange={handleLowestFirstChange}
					/>
					<label htmlFor="lowest-first-radio">Lowest first</label>
				</Div>
				<Div>
					<input
						id="az-radio"
						type="radio"
						name="sort"
						onChange={handleAzChange}
					/>
					<label htmlFor="az-radio">A - Z</label>
					<input
						id="za-radio"
						name="sort"
						onChange={handleZaChange}
						type="radio"
					/>
					<label htmlFor="za-radio">Z - A</label>
				</Div>
			</RadioGroup>
			<H4>Filter</H4>
			<FilterInput
				onChange={handleFilterInputChange}
				type="text"
				value={filterInputValue}
			/>
		</Wrapper>
	)
}

export default React.memo(Options)
