import React from 'react'

import Histogram from './histogram'
import Bars from './bars'

import type { RangeFacetProps } from '.'

function RangeFacetBody(props: RangeFacetProps) {
	return (
		<>
			<Histogram
				facetData={props.facetData}
				values={props.values}
			/>
			<Bars
				facetData={props.facetData}
			/>
		</>
	)
}

export default React.memo(RangeFacetBody)

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
