import * as React from 'react';
interface Props {
    clearFullTextInput: () => void;
    dispatch: React.Dispatch<FacetsDataReducerAction>;
    filters: ActiveFilter[];
    query: string;
}
declare function ActiveFiltersDetails(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof ActiveFiltersDetails>;
export default _default;
