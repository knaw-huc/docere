import React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING } from '../../constants'

const Wrapper = styled.div`
	margin-bottom: ${DEFAULT_SPACING/4}px;
`

const Title = styled.div`
	color: #888;
	display: block;
	font-size: .75rem;
	margin-bottom: .25rem;
	text-transform: uppercase;
`

interface Props {
	title: string
	children: React.ReactNode
}
export function MetadataWrapper(props: Props) {
	return (
		<Wrapper>
			<Title>{props.title}</Title>
			{props.children}
		</Wrapper>
	)
}
