import ESRequest from './request-creator';
interface AggregationRequest {
    aggs: any;
    filter?: any;
}
declare type Aggregations = {
    [id: string]: AggregationRequest;
};
declare type Highlight = {
    fields: {
        text: {};
    };
    require_field_match: boolean;
};
export default class ESRequestWithFacets extends ESRequest {
    aggs: Aggregations;
    highlight: Highlight;
    post_filter: Record<string, any>;
    query: Record<string, any>;
    constructor(options: ElasticSearchRequestOptions);
    private setPostFilter;
    private setAggregations;
    private addFilter;
    private addHierarchyFilter;
    private createBooleanAggregation;
    private tmp;
    private createHierarchyAggregation;
    private createListAggregation;
    private createHistogramAggregation;
    private createDateHistogramAggregation;
    private setQuery;
}
export {};
