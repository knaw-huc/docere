import * as React from 'react';
declare function HierarchyFacet(props: HierarchyFacetProps): JSX.Element;
declare namespace HierarchyFacet {
    var defaultProps: {
        filters: Set<unknown>;
        size: number;
        values: {
            values: any[];
            total: number;
        };
    };
}
declare const _default: React.MemoExoticComponent<typeof HierarchyFacet>;
export default _default;
