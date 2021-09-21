import React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING } from '../../constants'

const Wrapper = styled.div`
	margin-bottom: ${DEFAULT_SPACING/4}px;
	display: grid;
	grid-template-columns: 150px auto;
`

const Title = styled.div`
	color: #888;
	font-size: .75rem;
	line-height: 1rem;
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
			<div>
				{props.children}
			</div>
		</Wrapper>
	)
}
