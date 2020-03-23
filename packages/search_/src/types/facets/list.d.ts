type ListFacetData = ListFacetConfig & {
	filters: Set<string>
	query: string
	sort: {
		by: import('../../constants').SortBy,
		direction: import('../../constants').SortDirection
	}
	viewSize: number
} 

interface ListFacetValues {
	total: number
	values: KeyCount[]
}

interface ListFacetProps {
	facetData: ListFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: ListFacetValues
}
