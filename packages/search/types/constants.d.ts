export declare const SPOT_COLOR = "#08c";
export declare const BACKGROUND_GRAY = "#f6f6f6";
export declare function isBooleanFacet(facetConfig: FacetConfigBase): facetConfig is BooleanFacetConfig;
export declare function isDateFacet(facetConfig: FacetConfigBase): facetConfig is DateFacetConfig;
export declare function isHierarchyFacet(facetConfig: FacetConfigBase): facetConfig is HierarchyFacetConfig;
export declare function isListFacet(facetConfig: FacetConfigBase): facetConfig is ListFacetConfig;
export declare function isRangeFacet(facetConfig: FacetConfigBase): facetConfig is RangeFacetConfig;
export declare function getChildFieldName(parentFieldName: string, number?: number): string;
export declare enum SortBy {
    Count = "_count",
    Key = "_term"
}
export declare enum SortDirection {
    Asc = "asc",
    Desc = "desc"
}
