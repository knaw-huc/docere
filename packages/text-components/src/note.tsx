import React from 'react'
import { DEFAULT_POPUP_BG_COLOR } from '@docere/common'
import type { DocereComponentProps } from '@docere/common'
import styled from 'styled-components'
import Popup from './popup'

interface NAProps { active: boolean, color: string, openToAside: boolean }
const Wrapper = styled.div`
	background-color: ${(props: NAProps) => props.active ? props.color : 'white' };
	border-radius: 0.2em;
	color: ${props => props.active ? 'white' : props.color };
	cursor: pointer;
	display: inline-block;
	font-family: monospace;
	font-size: 1rem;
	font-weight: bold;
	line-height: 1rem;
	min-width: 1rem;
	padding: 0.1em;
	position: ${props => props.openToAside ? 'static' : 'relative'};
	text-align: center;
	transition: all 150ms;
	vertical-align: super;
`

export default function Note(props: DocereComponentProps & { id: string, title: string, n: string, color?: string }) {
	if (!props.entrySettings['panels.text.showNotes']) return <span>{props.children}</span>

	const active = props.id === props.activeNote?.id
	const openToAside = active && !props.entrySettings['panels.text.openPopupAsTooltip']

	return (
		<Wrapper
			active={active}
			color={props.color}
			onClick={() => {
				props.entryDispatch({ type: 'SET_NOTE', id: props.id })
			}}
			openToAside={openToAside}
		>
			{props.n}
			<Popup
				active={active}
				color={props.color}
				docereComponentProps={props}
				node={props.entry.notes?.find(n => n.id === props.id)?.el}
				openToAside={openToAside}
				title={props.title}
			/>
		</Wrapper>
	)
}
Note.defaultProps = { color: DEFAULT_POPUP_BG_COLOR }
