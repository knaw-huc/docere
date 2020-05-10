import React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, PANEL_HEADER_HEIGHT, Colors } from '@docere/common'
import type { EntryStateAction, Layer } from '@docere/common'

const Header = styled.header`
	background: ${Colors.Grey};
	box-shadow: 0 1px 4px #888;
	font-size: .8rem;
	height: ${PANEL_HEADER_HEIGHT}px;
	line-height: ${PANEL_HEADER_HEIGHT}px;
	padding-left: ${DEFAULT_SPACING}px;
	position: relative;
`

const Title = styled.div`
	color: #EEE;

	small {
		color: #888;
		margin-right: .33rem;
	}
`

const Close = styled.div`
	color: #888;
	cursor: pointer;
	position: absolute;
	right: ${DEFAULT_SPACING}px;
	text-align: center;
	top: 0;
	width: ${DEFAULT_SPACING}px;

	&:hover {
		color: #EEE;
	}
`

interface Props {
	children: React.ReactNode
	entryDispatch: React.Dispatch<EntryStateAction>,
	layer: Layer
}
export default function PanelHeader(props: Props) {
	const togglePanel = React.useCallback(() => {
		props.entryDispatch({ type: 'TOGGLE_LAYER' , id: props.layer.id })			
	}, [])

	return (
		<Header>
			<Title>
				<small>panel</small>
				{props.children}
			</Title>
			<Close onClick={togglePanel}>✖</Close>
		</Header>
	)
}
