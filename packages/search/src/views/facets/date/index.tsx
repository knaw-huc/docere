import * as React from 'react'
import FacetHeader from '../header'
import FacetWrapper from '../facet'
import DateFacetBody from './body'


function DateFacetView(props: DateFacetProps) {
	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			{
				props.values.length > 0 &&
				<DateFacetBody { ...props } />
			}
		</FacetWrapper>
	)
}

DateFacetView.defaultProps = {
	values: []
}

export default React.memo(DateFacetView)
