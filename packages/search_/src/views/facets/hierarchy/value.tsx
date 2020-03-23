import * as React from 'react'
import styled, { css } from "styled-components"

const Wrapper = styled('li')`
	cursor: pointer;
	display: grid;
	grid-template-columns: 20px 4fr 1fr;
	margin-bottom: .2em;

	& > input {
		margin-left: 0;
	}
`

const common = (props: { active: boolean }) => css`
	color: ${props.active ? '#444' : '#888' };
	font-size: .9em;
	font-weight: ${props.active ? 'bold' : 'normal' };
`

const Key = styled('span')`
	${common}
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Count = styled('span')`
	${common}
	text-align: right;
`

interface Props {
	active: boolean
	facetData: HierarchyFacetData
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	keyFormatter?: (key: string | number) => string
	value: HierarchyKeyCount
}

function FacetValueView(props: Props) {
	const handleChange = React.useCallback(() => {
		const type = props.active ? 'remove_filter' : 'add_filter'
		props.facetsDataDispatch({ type, facetId: props.facetData.id, value: props.value.key })

	}, [props.active, props.facetData.id, props.value.key])

	return (
		<Wrapper
			onClick={handleChange}
			title={props.value.key}
		>
			<input
				checked={props.active}
				onChange={handleChange}
				type="checkbox"
			/>
			<Key active={props.active} dangerouslySetInnerHTML={{ __html: props.keyFormatter(props.value.key) }}></Key>
			<Count active={props.active}>{props.value.count}</Count>
		</Wrapper>

	)
}

FacetValueView.defaultProps = {
	keyFormatter: (value: string) => value
}

export default React.memo(FacetValueView)
