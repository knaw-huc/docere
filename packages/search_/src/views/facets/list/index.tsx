import * as React from 'react'
import FacetValuesView from './values'
import Options from './options'
import Facet from '../facet'

function ListFacet(props: ListFacetProps) {
	return (
		<Facet
			facetProps={props}
			Options={Options}
		>
			<FacetValuesView
				facetData={props.facetData}
				facetsDataDispatch={props.facetsDataDispatch}
				values={props.values}
			/>
		</Facet>
	)
}

ListFacet.defaultProps = {
	filters: new Set,
	size: 10,
	values: {
		values: [],
		total: 0
	}
}

export default React.memo(ListFacet)
