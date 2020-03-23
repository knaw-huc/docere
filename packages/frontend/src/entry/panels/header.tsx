import React from 'react'
import { DEFAULT_SPACING } from '@docere/common'
import styled from 'styled-components'

const Header = styled.header`
	background: #EEE;
	box-shadow: 0 1px 4px #888;
	color: #444;
	font-size: .8rem;
	height: ${DEFAULT_SPACING}px;
	line-height: ${DEFAULT_SPACING}px;
	padding-left: ${DEFAULT_SPACING}px;
	position: relative;
	text-transform: uppercase;
`

const Title = styled.div``

const Close = styled.div`
	background: #DDD;
	cursor: pointer;
	position: absolute;
	right: ${DEFAULT_SPACING}px;
	text-align: center;
	top: 0;
	width: ${DEFAULT_SPACING}px;

	&:hover {
		font-weight: bold;
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
			<Title>{props.children}</Title>
			<Close onClick={togglePanel}>x</Close>
		</Header>
	)
}
