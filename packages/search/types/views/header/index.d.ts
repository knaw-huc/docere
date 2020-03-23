import * as React from 'react';
declare type Props = Pick<AppProps, 'resultsPerPage'> & {
    autoSuggest: AppProps['autoSuggest'];
    clearActiveFilters: () => void;
    clearFullTextInput: () => void;
    currentPage: number;
    dispatch: React.Dispatch<FacetsDataReducerAction>;
    facetsData: FacetsData;
    query: string;
    searchResult: FSResponse;
    setCurrentPage: (pageNumber: number) => void;
    setSortOrder: SetSortOrder;
    sortOrder: SortOrder;
};
declare function Header(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Header>;
export default _default;
