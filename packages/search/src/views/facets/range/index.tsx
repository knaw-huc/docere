import * as React from 'react'
import FacetHeader from '../header'
import FacetWrapper from '../facet'
import RangeFacetBody from './body'


function RangeFacetView(props: RangeFacetProps) {
	return (
		<FacetWrapper>
			<FacetHeader facetData={props.facetData} />
			{
				props.values.length > 0 &&
				<RangeFacetBody { ...props } />
			}
		</FacetWrapper>
	)
}

RangeFacetView.defaultProps = {
	values: []
}

export default React.memo(RangeFacetView)
