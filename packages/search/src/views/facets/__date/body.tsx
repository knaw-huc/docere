import React from 'react'
import styled from 'styled-components'

import Histogram from './histogram'
import { isDateFacetData } from '../../../utils'
import { getEndDate, formatDate } from './utils'

import type { DateFacetProps } from '.'

const Dates = styled('div')`
	color: #888;
	display: grid;
	font-size: .9em;
	grid-template-columns: 1fr auto 1fr;
	margin-top: 1em;
`

const Date = styled.span``
const DateMax = styled(Date)`
	justify-self: end;
`

const ActiveDates = styled('div')`
	color: #444;
	display: grid;
	font-weight: bold;
	grid-template-columns: 1fr 16px 1fr;
`

function DateFacetBody(props: DateFacetProps) {
	// console.log('in datef', props.values)
	const minValue = props.values[0].key
	const maxValue = getEndDate(props.values[props.values.length - 1].key, props.facetData.interval)

	const minDate = isDateFacetData(props.facetData) ? formatDate(minValue, props.facetData.interval) : props.values[0].count
	const maxDate = isDateFacetData(props.facetData) ? formatDate(maxValue, props.facetData.interval) : props.values.reduce((prev, curr) => prev + curr.count, 0)

	// console.log(minValue, maxValue)
	// console.log(props.facetData, minDate, maxDate)
	// console.log(props.values[0].key, props.values[props.values.length - 1].key + props.facetData.interval)
	return (
		<>
			<Histogram
				facetData={props.facetData}
				values={props.values}
			/>
			{/* <Slider
				lowerLimit={lowerLimit}
				onChange={(data: any) => {
					// const rangeMin = ratioToTimestamp(data.lowerLimit, props.values)
					// const rangeMax = ratioToTimestamp(data.upperLimit, props.values)
					// setRange([ rangeMin, ran)geMax ])
					console.log(data)
				}}
				style={{
					marginTop: '-6px',
					position: 'absolute',
				}}
				upperLimit={upperLimit}
			/> */}
			<Dates>
				<Date>{minDate}</Date>
				<ActiveDates>
					{/* {
						rangeMin != null && rangeMax != null &&
						<>
							<span style={{textAlign: 'right'}}>{fMin}</span>
							<span style={{textAlign: 'center'}}>-</span>
							<span>{fMax}</span>
						</>
					} */}
				</ActiveDates>
				<DateMax>{maxDate}</DateMax>
			</Dates>
		</>
	)
}

export default React.memo(DateFacetBody)
