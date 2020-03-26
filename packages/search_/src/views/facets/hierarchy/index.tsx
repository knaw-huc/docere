import * as React from 'react'
import FacetValuesView from '../list/values'
import FacetBase from '../facet'
import styled from 'styled-components'

const Facet = styled(FacetBase)`
	.child {
		margin-left: .5rem;
	}
`
function HierarchyFacet(props: HierarchyFacetProps) {
	return (
		<Facet facetProps={props}>
			{renderNodes(props)}
		</Facet>
	)
}

function renderNodes(props: HierarchyFacetProps) {
	function renderNode(values: HierarchyFacetValues): any {
		if (values == null || !values.values.length) return null
		return (
			<>
				<FacetValuesView
					facetData={props.facetData}
					facetsDataDispatch={props.facetsDataDispatch}
					values={values}
				/>
				{
					values.values.length > 0 &&
					<div className="child">{renderNode(values.values[0].child)}</div>
				}
			</>
		)
	}

	return renderNode(props.values)
}

HierarchyFacet.defaultProps = {
	filters: new Set,
	size: 10,
	values: {
		values: [],
		total: 0
	}
}

export default React.memo(HierarchyFacet)
