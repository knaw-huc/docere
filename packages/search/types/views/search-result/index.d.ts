import * as React from 'react';
declare type Props = Pick<AppProps, 'onClickResult' | 'ResultBodyComponent' | 'resultBodyProps'> & {
    searchResult: FSResponse;
};
declare function HucSearchResults(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof HucSearchResults>;
export default _default;
