export default class ESRequest {
    _source: {
        include?: AppProps['resultFields'];
        exclude?: AppProps['excludeResultFields'];
    };
    from: number;
    size: number;
    sort: any;
    track_total_hits: number;
    constructor(options: ElasticSearchRequestOptions);
    private setSource;
}
