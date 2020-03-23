type BooleanFacetData = BooleanFacetConfig & {
	filters: Set<string>
} 

type BooleanFacetValues = [
	{ key: 'true', count: number},
	{ key: 'false', count: number}
]


interface BooleanFacetProps {
	facetData: BooleanFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: BooleanFacetValues
}
