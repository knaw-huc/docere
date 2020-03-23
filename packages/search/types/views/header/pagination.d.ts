import * as React from 'react';
interface Props {
    currentPage: number;
    resultsPerPage: number;
    searchResults: FSResponse;
    setCurrentPage: (pageNumber: number) => void;
}
declare function Pagination(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Pagination>;
export default _default;
