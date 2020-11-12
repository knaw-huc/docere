import React from 'react'
import styled from 'styled-components'
import { EntrySettingsContext, EntrySettings } from '@docere/common'


const Wrapper = styled.span`
	display: ${(props: { settings: EntrySettings }) => props.settings['panels.text.showLineBeginnings'] ? 'block' : 'inline' };

	&:before {
		box-sizing: border-box;
		color: #888;
		content: counter(linenumber);
		counter-increment: linenumber;
		display: ${props => props.settings['panels.text.showLineBeginnings'] ? 'block' : 'none' };
		font-family: RobotoMono;
		font-size: .66em;
		position: absolute;
		text-align: right;
		width: 42px;
		margin-left: -48px;
		padding-right: 8px;
	}
`
export function Lb(props: { children?: React.ReactNode }) {
	const { settings } = React.useContext(EntrySettingsContext)

	return (
		<Wrapper settings={settings}>
			{props.children}
		</Wrapper>
	)

}
