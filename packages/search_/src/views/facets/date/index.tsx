import React from 'react'

import Facet from '../facet'
import DateFacetBody from './body'

import type { DateFacetData, RangeFacetValues } from '@docere/common'

export interface DateFacetProps {
	facetData: DateFacetData
	values: RangeFacetValues
}
function DateFacetView(props: DateFacetProps) {
	return (
		<Facet
			facetProps={props}
		>
			{/* <FacetHeader facetData={props.facetData} /> */}
			{
				props.values.length > 0 &&
				<DateFacetBody { ...props } />
			}
		</Facet>
	)
}

DateFacetView.defaultProps = {
	values: []
}

export default React.memo(DateFacetView)
