import React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import { SearchContext, SearchPropsContext, SortBy, SortDirection } from '@docere/common'

import { inputStyle } from '../../full-text-search'

import type { ListFacetProps } from '.'

export const OptionsWrapper = styled('div')`
	border: 1px solid ${(props: { color: string }) => props.color};
	background: ${(props: { color: string }) => `${props.color}11`};
	font-size: .75rem;
	grid-column: 1 / -1;
	margin-bottom: 1rem;
	padding: .5rem;
`

export const OptionsGroup = styled.div`
	background: white;
	border: 1px solid #AAA;
	padding: 1em;
`

const RadioGroup = styled(OptionsGroup)`
	display: grid;
	grid-template-columns: 1fr 1fr;
`

const Div = styled('div')`
	list-style: none;
	display: grid;
	grid-template-columns: 24px 1fr;
	grid-template-rows: 1fr 1fr;
`

export const OptionsTitle = styled('h4')`
	color: #222;
	font-weight: normal;
	margin: 1em 0 .2em 0;
	padding: 0;
`

const FilterInput = styled('input')`
	${inputStyle}
	border: 1px solid #AAA;
	height: 2em;
	width: 100%;
`

function Options(props: ListFacetProps) {
	const { i18n, style } = React.useContext(SearchPropsContext)
	const { dispatch } = React.useContext(SearchContext)
	const [filterInputValue, setFilterInputValue] = React.useState('')

	const handleCheckboxChange = React.useCallback(
		ev => dispatch({
			type: 'set_sort',
			facetId: props.facetData.config.id,
			by: ev.target.dataset.by,
			direction: ev.target.dataset.direction
		}),
		[props.facetData.config.id]
	)

	const setQuery = debounce((value: string) => dispatch({ type: 'set_query', facetId: props.facetData.config.id, value }), 600)
	const handleFilterInputChange = React.useCallback(
		(ev: React.ChangeEvent<HTMLInputElement>) => {
			setFilterInputValue(ev.target.value)
			setQuery(ev.target.value)
		},
		[]
	)

	return (
		<OptionsWrapper color={style.spotColor}>
			<OptionsTitle>{i18n.list_facet_order}</OptionsTitle>
			<RadioGroup>
				<Div>
					<input
						checked={props.facetData.sort.by === SortBy.Count && props.facetData.sort.direction === SortDirection.Desc}
						data-by={SortBy.Count}
						data-direction={SortDirection.Desc}
						id="highest-first-radio"
						name="sort"
						onChange={handleCheckboxChange}
						type="radio"
					/>
					<label htmlFor="highest-first-radio">{i18n.highest_first}</label>
					<input
						checked={props.facetData.sort.by === SortBy.Count && props.facetData.sort.direction === SortDirection.Asc}
						data-by={SortBy.Count}
						data-direction={SortDirection.Asc}
						id="lowest-first-radio"
						type="radio"
						name="sort"
						onChange={handleCheckboxChange}
					/>
					<label htmlFor="lowest-first-radio">{i18n.lowest_first}</label>
				</Div>
				<Div>
					<input
						checked={props.facetData.sort.by === SortBy.Key && props.facetData.sort.direction === SortDirection.Asc}
						data-by={SortBy.Key}
						data-direction={SortDirection.Asc}
						id="az-radio"
						type="radio"
						name="sort"
						onChange={handleCheckboxChange}
					/>
					<label htmlFor="az-radio">A - Z</label>
					<input
						checked={props.facetData.sort.by === SortBy.Key && props.facetData.sort.direction === SortDirection.Desc}
						data-by={SortBy.Key}
						data-direction={SortDirection.Desc}
						id="za-radio"
						name="sort"
						onChange={handleCheckboxChange}
						type="radio"
					/>
					<label htmlFor="za-radio">Z - A</label>
				</Div>
			</RadioGroup>
			<OptionsTitle>{i18n.list_facet_filter}</OptionsTitle>
			<FilterInput
				onChange={handleFilterInputChange}
				type="text"
				value={filterInputValue}
			/>
		</OptionsWrapper>
	)
}

export default React.memo(Options)
