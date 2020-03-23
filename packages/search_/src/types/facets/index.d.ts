/// <reference path="./boolean.d.ts" />
/// <reference path="./date.d.ts" />
/// <reference path="./list.d.ts" />
/// <reference path="./hierarchy.d.ts" />
/// <reference path="./range.d.ts" />

type FacetValues = ListFacetValues | BooleanFacetValues | RangeFacetValues

type FacetData = ListFacetData | BooleanFacetData | HierarchyFacetData | RangeFacetData | DateFacetData
type FacetsData = Map<string, FacetData>

interface FacetProps {
	id: string
	title: string
}
