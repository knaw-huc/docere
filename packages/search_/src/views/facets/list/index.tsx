import React from 'react'

import ListFacetValuesView from './values'
import Options from './options'
import Facet from '../facet'

import type { ListFacetData, ListFacetValues } from '@docere/common'

export interface ListFacetProps {
	facetData: ListFacetData
	values: ListFacetValues
}
function ListFacet(props: ListFacetProps) {
	return (
		<Facet
			facetProps={props}
			Options={Options}
		>
			<ListFacetValuesView
				facetData={props.facetData}
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
