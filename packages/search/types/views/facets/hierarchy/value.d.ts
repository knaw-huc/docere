import * as React from 'react';
interface Props {
    active: boolean;
    facetData: HierarchyFacetData;
    facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>;
    keyFormatter?: (key: string | number) => string;
    value: HierarchyKeyCount;
}
declare function FacetValueView(props: Props): JSX.Element;
declare namespace FacetValueView {
    var defaultProps: {
        keyFormatter: (value: string) => string;
    };
}
declare const _default: React.MemoExoticComponent<typeof FacetValueView>;
export default _default;
