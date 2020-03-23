import * as React from 'react';
export declare const DropDownBody: import("@emotion/styled-base").StyledComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    show?: boolean;
    z?: number;
}, object>;
interface Props {
    children: React.ReactNode;
    className?: string;
    label: string;
    z: number;
}
declare function DropDown(props: Props): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof DropDown>;
export default _default;
