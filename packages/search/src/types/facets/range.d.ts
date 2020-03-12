interface RangeFacetFilter {
	from: number
	to?: number
}

type RangeFacetValues = RangeKeyCount[]

interface RangeFacetData extends RangeFacetConfig {
	filters: RangeFacetFilter,
	min: number,
	max: number
} 

interface RangeFacetProps {
	facetData: RangeFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: RangeFacetValues
}
