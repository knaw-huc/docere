import * as React from 'react'
import ListFacetValueView from '../list/value'
import styled from 'styled-components'
import Facet from '../facet'
import type { BooleanFacetData, FacetsDataReducerAction, BooleanFacetValues } from '@docere/common'

const List = styled('ul')`
	margin: 0;
	padding: 0;
`

interface BooleanFacetProps {
	facetData: BooleanFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: BooleanFacetValues
}
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
							<ListFacetValueView
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
