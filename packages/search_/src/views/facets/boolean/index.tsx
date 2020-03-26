import * as React from 'react'
import FacetValueView from '../list/value'
import styled from 'styled-components'
import Facet from '../facet'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

function BooleanFacet(props: BooleanFacetProps) {
	return (
		<Facet
			facetProps={props}
		>
			{/* <FacetHeader facetData={props.facetData} /> */}
			<List>
				{
					props.values
						.filter(v => v.count > 0)
						.map(value =>
							<FacetValueView
								active={props.facetData.filters.has(value.key)}
								facetId={props.facetData.id}
								facetsDataDispatch={props.facetsDataDispatch}
								key={value.key}
								// TODO remove labels and use props.keyFormatter
								// keyFormatter={() => props.facetData.labels.true}
								value={value}
							/>
						)
				}
			</List>
		</Facet>
	)
}

BooleanFacet.defaultProps = {
	values: []
}

export default React.memo(BooleanFacet)
