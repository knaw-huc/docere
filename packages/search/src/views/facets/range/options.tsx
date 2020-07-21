import React from 'react'
import styled from 'styled-components'
import { OptionsWrapper } from '../list/options'
import SearchContext from '../../../facets-context'
import { DateFacetData, RangeFacetData } from '@docere/common'
import { dateRangeToFacetValue, rangeToFacetValue } from '../../../use-search/get-buckets'
import { isDateFacetData } from '../../../utils'
import FacetedSearchContext from '../../../context'

// Convert a timestamp to a <input type="date" /> value: yyyy-mm-dd
function timestampToDateInputValue(timestamp: number) {
	const isoDate = new Date(timestamp).toISOString()
	return isoDate.slice(0, isoDate.indexOf('T'))
}
const Fieldset = styled.fieldset`
	padding: 1rem;

	legend {
		color: #AAA;
		padding: 0 .33rem;
	}

	label {
		font-size: .8rem;
	}

	& > div {
		display: grid;
		grid-template-columns: 60px auto;
		grid-template-rows: 1fr 1fr;
		grid-row-gap: 1rem;
	}
`
export default function RangeOptions(props: { facetData: RangeFacetData | DateFacetData }) {
	const { dispatch } = React.useContext(SearchContext)
	const { i18n } = React.useContext(FacetedSearchContext)

	// There can be multpiple range facets. To get a unique ID, prefix it with the facet ID
	const idPrefix = `${props.facetData.config.id}_range_`

	const from = props.facetData.filters.length ?
		props.facetData.filters[props.facetData.filters.length - 1].from :
		props.facetData.value.from

	const to = props.facetData.filters.length ?
		props.facetData.filters[props.facetData.filters.length - 1].to :
		props.facetData.value.to

	const [minValueState, setMinValueState] = React.useState(from)
	const [maxValueState, setMaxValueState] = React.useState(to)

	const isDateFacet = isDateFacetData(props.facetData)
	const minInputValue = isDateFacet ? timestampToDateInputValue(from) : from
	const maxInputValue = isDateFacet ? timestampToDateInputValue(to) : to
	const fromInputValue = isDateFacet ? timestampToDateInputValue(minValueState) : minValueState
	const toInputValue = isDateFacet ? timestampToDateInputValue(maxValueState) : maxValueState

	React.useEffect(() => {
		setMinValueState(from)
		setMaxValueState(to)
	}, [from, to])

	const handleInputBlur = React.useCallback(() => {
		dispatch({
			type: 'SET_FILTER',
			facetId: props.facetData.config.id,
			value: isDateFacet ?
				dateRangeToFacetValue(minValueState, maxValueState) :
				rangeToFacetValue(minValueState, maxValueState),
		 })
	}, [minValueState, maxValueState])

	/**
	 * I don't know why the deps of handleInputBlur are needed here, but they are :).
	 * It has to do with an old ref to handleInputBlur, but this is confusing,
	 * because those deps aren't used directly in this callback 
	 */
	const handleInputKeyDown = React.useCallback(ev => {
		if (ev.keyCode === 13) handleInputBlur()
	}, [minValueState, maxValueState])

	const handleInputChange = React.useCallback(ev => {
		const target: HTMLInputElement = ev.target
		const resetValue = !ev.target.value.length

		if (target.id === `${idPrefix}from`) {
			if (resetValue) {
				setMinValueState(from)
				handleInputBlur()
			} else {
				setMinValueState(target.valueAsNumber)
			}
		} else {
			if (resetValue) {
				setMaxValueState(to)
				handleInputBlur()
			} else {
				setMaxValueState(target.valueAsNumber)
			}
		}
	}, [from, to])

	return (
		<OptionsWrapper>
			<Fieldset>
				<legend>{i18n.set_range}</legend>
				<div>
					<label htmlFor={`${idPrefix}from`}>{i18n.range_from}</label>
					<input
						id={`${idPrefix}from`}
						max={maxInputValue}
						min={minInputValue}
						onBlur={handleInputBlur}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						type={isDateFacet ? 'date' : 'number'}
						value={fromInputValue}
					/>
					<label htmlFor={`${idPrefix}to`}>{i18n.range_to}</label>
					<input
						id={`${idPrefix}to`}
						max={maxInputValue}
						min={minInputValue}
						onBlur={handleInputBlur}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						type={isDateFacet ? 'date' : 'number'}
						value={toInputValue}
					/>
				</div>
			</Fieldset>
		</OptionsWrapper>
	)
}
