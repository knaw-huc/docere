import React from 'react'

import Facet from '../facet'
import ListFacetValueView from '../list/value'
import { FacetValuesList } from '../list/values'

import type { BooleanFacetData, BooleanFacetValues } from '@docere/common'

interface BooleanFacetProps {
	facetData: BooleanFacetData
	values: BooleanFacetValues
}
function BooleanFacet(props: BooleanFacetProps) {
	return (
		<Facet
			facetProps={props}
		>
			{/* <FacetHeader facetData={props.facetData} /> */}
			<FacetValuesList>
				{
					props.values
						.filter(v => v.count > 0)
						.map(value =>
							<ListFacetValueView
								active={props.facetData.filters.has(value.key)}
								facetId={props.facetData.config.id}
								key={value.key}
								// TODO remove labels and use props.keyFormatter
								// keyFormatter={() => props.facetData.labels.true}
								value={value}
							/>
						)
				}
			</FacetValuesList>
		</Facet>
	)
}

BooleanFacet.defaultProps = {
	values: []
}

export default React.memo(BooleanFacet)
