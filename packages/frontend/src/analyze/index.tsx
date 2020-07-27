import React from 'react'
import useAnalyzeState from './state'
import styled from 'styled-components'

interface SLProps {
	title: string
	values: string[]
}
function SearchList(props: SLProps) {
	return (
		<div>
			<h3>{props.title}</h3>
			<ul>
				{
					props.values.map((v, i) =>
						<li key={i}>
							{v}
						</li>
					)
				}
			</ul>
		</div>
	)
}

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 30% 20% 20% 30%;
`

export default function Analyze() {
	const [state, dispatch] = useAnalyzeState()
	dispatch

	return (
		<Wrapper>
			<SearchList
				title="Documents"
				values={state.documents}
			/>
			<SearchList
				title="Tags"
				values={state.tags}
			/>
			<SearchList
				title="Attribute names"
				values={state.attributeNames}
			/>
			<SearchList
				title="Attribute values"
				values={state.attributeValues}
			/>
		</Wrapper>
	)
}
