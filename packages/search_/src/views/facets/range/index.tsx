import * as React from 'react'
import Facet from '../facet'
import RangeFacetBody from './body'


function RangeFacetView(props: RangeFacetProps) {
	return (
		<Facet
			facetProps={props}
		>
			{
				props.values.length > 0 &&
				<RangeFacetBody { ...props } />
			}
		</Facet>
	)
}

RangeFacetView.defaultProps = {
	values: []
}

export default React.memo(RangeFacetView)
