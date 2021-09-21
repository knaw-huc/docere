import * as React from 'react'
import styled from 'styled-components'
import { FacetData } from '../../../types/search/facets'
import { SearchControls } from '../search-controls'

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: fit-content(70%) fit-content(30%);

	& > span:nth-of-type(2) {
	}
`

export interface ValueProps {
	facet: FacetData
	id: string
	value: string
}
export default function Value(props: ValueProps) {
	return (
		<Wrapper>
			<span>{props.value}</span>
			{
				props.facet &&
				<SearchControls {...props} />
			}
		</Wrapper>
	)
}
