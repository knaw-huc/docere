/// <reference path="../../search_/src/types/index.d.ts" />
import * as React from 'react';
declare function FacetedSearch(props: AppProps): JSX.Element;
declare namespace FacetedSearch {
    var defaultProps: {
        excludeResultFields: any[];
        fields: any[];
        resultFields: any[];
        resultsPerPage: number;
    };
}
declare const _default: React.MemoExoticComponent<typeof FacetedSearch>;
export default _default;
