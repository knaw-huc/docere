import * as React from 'react'
import styled from 'styled-components'
import { SearchControls } from '../search-controls'

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: fit-content(70%) fit-content(30%);

	& > span:nth-of-type(2) {
	}
`

export interface ValueProps {
	active: boolean
	id: string
	value: string
}
export default function Value(props: ValueProps) {
	return (
		<Wrapper>
			<span>{props.value}</span>
			<SearchControls {...props} />
		</Wrapper>
	)
}
