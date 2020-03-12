import React from 'react'
import { DEFAULT_POPUP_BG_COLOR } from '@docere/common'
import styled from 'styled-components'
import Popup from './popup'

interface NAProps { active: boolean, color: string, layer: TextLayer }
const Wrapper = styled.div`
	background-color: ${(props: NAProps) => props.active ? props.color : 'white' };
	border-radius: 1em;
	border: 2px solid ${props => props.color};
	color: ${props => props.active ? 'white' : props.color };
	cursor: pointer;
	display: inline-block;
	font-family: monospace;
	font-size: .8rem;
	font-weight: bold;
	height: 1.4em;
	line-height: 1.4em;
	margin: 0 .25em;
	position: ${props => props.layer.asideActive ? 'static' : 'relative'};
	text-align: center;
	transition: all 150ms;
	width: 1.6em;
`
export default function Note(props: DocereComponentProps & { id: string, title: string, n: string, color?: string }) {
	const active = props.id === props.activeNote?.id

	return (
		<Wrapper
			active={active}
			color={props.color}
			layer={props.layer}
			onClick={() => {
				props.entryDispatch({ type: 'SET_NOTE', id: props.id })
			}}
		>
			{props.n}
			<Popup
				active={active}
				color={props.color}
				docereComponentProps={props}
				node={props.entry.notes?.find(n => n.id === props.id)?.el}
				title={props.title}
			/>
		</Wrapper>
	)
}
Note.defaultProps = { color: DEFAULT_POPUP_BG_COLOR }
