import * as React from 'react';
interface Props {
    autoSuggest: (query: string) => Promise<string[]>;
    onClick: (query: string) => void;
    value: string;
}
interface State {
    suggestions: string[];
}
export default class AutoSuggest extends React.PureComponent<Props, State> {
    private cache;
    state: State;
    componentDidUpdate(prevProps: Props, prevState: State): Promise<void>;
    render(): JSX.Element;
    private autoSuggest;
    private requestAutoSuggest;
}
export {};
