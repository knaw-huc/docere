import * as React from 'react';
declare type Props = Pick<HierarchyFacetProps, 'facetData' | 'facetsDataDispatch' | 'values'> & {
    collapse: boolean;
};
declare function FacetValuesView(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof FacetValuesView>;
export default _default;
