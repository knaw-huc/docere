type HierarchyFacetData = HierarchyFacetConfig & {
	filters: Set<string>
	// query: string
	// sort: {
	// 	by: SortBy,
	// 	direction: SortDirection
	// }
	viewSize: number
} 

interface HierarchyKeyCount {
	child: HierarchyFacetValues
	count: number
	key: string,
}

interface HierarchyFacetValues {
	total: number
	values: HierarchyKeyCount[]
}

interface HierarchyFacetProps {
	facetData: HierarchyFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	values: HierarchyFacetValues
}
