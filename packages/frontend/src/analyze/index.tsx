import React from 'react'
import useAnalyzeState from './state'
import styled from 'styled-components'
import { SearchList } from './list'


const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 35% 20% 20% 25%;
	grid-template-rows: 10vh auto auto auto;
	grid-auto-flow: column;
	height: 100vh;

	h3, ul {
		padding-left: .5rem;
	}

	ul {
		overflow: auto;

		&.selected {
			background: #a3a3ff;
		}

		&.active {
			background: #d4d4ff;
		}

		li {
			cursor: pointer;
			white-space: nowrap;

			&:hover {
				color: brown;
			}
		}
	}
`

export default function Analyze() {
	const [state, dispatch] = useAnalyzeState()

	console.log(state)
	return (
		<Wrapper>
			<SearchList
				activeValues={state.activeDocuments}
				dispatch={dispatch}
				id="document_name"
				selectedValues={state.selectedDocuments}
				title="Documents"
				values={state.documents}
			/>
			<SearchList
				activeValues={state.activeTags}
				dispatch={dispatch}
				id="tag_name"
				selectedValues={state.selectedTags}
				title="Tags"
				values={state.tags}
			/>
			<SearchList
				activeValues={state.activeAttributeNames}
				dispatch={dispatch}
				id="attribute_name"
				selectedValues={state.selectedAttributeNames}
				title="Attribute names"
				values={state.attributeNames}
			/>
			<SearchList
				activeValues={state.activeAttributeValues}
				dispatch={dispatch}
				id="attribute_value"
				selectedValues={state.selectedAttributeValues}
				title="Attribute values"
				values={state.attributeValues}
			/>
		</Wrapper>
	)
}
