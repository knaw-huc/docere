import * as React from 'react';
declare function ListFacet(props: ListFacetProps): JSX.Element;
declare namespace ListFacet {
    var defaultProps: {
        filters: Set<unknown>;
        size: number;
        values: {
            values: any[];
            total: number;
        };
    };
}
declare const _default: React.MemoExoticComponent<typeof ListFacet>;
export default _default;
