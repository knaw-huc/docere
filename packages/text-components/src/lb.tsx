import React from 'react'
import styled, { css } from 'styled-components'
import { EntrySettingsContext, EntrySettings } from '@docere/common'

export const LbCommon = css`
	box-sizing: border-box;
	color: #888;
	font-family: RobotoMono;
	font-size: .66em;
	position: absolute;
	text-align: right;
	width: 42px;
	margin-left: -48px;
	padding-right: 8px;
`

const Wrapper = styled.span`
	display: ${(props: { settings: EntrySettings }) =>
		props.settings['panels.text.showLineBeginnings'] ? 'block' : 'inline' };

	&:before {
		${LbCommon}
		content: counter(linenumber);
		counter-increment: linenumber;
		display: ${props =>
			props.settings['panels.text.showLineBeginnings'] ? 'block' : 'none' };
	}
`

interface Props {
	children?: React.ReactNode
}
export function Lb(props: Props) {
	const settings = React.useContext(EntrySettingsContext)

	return (
		<Wrapper
			settings={settings}
		>
			{props.children}
		</Wrapper>
	)

}
