import React from 'react'
import styled from 'styled-components'

import type { FacetsDataReducerAction, KeyCount } from '@docere/common'

interface WProps { active: boolean }
const Wrapper = styled('li')`
	cursor: pointer;
	font-size: .8rem;
	font-weight: ${(p: WProps) => p.active ? 'bold' : 'normal' };
	margin-bottom: .4rem;
	margin-left: 1rem;
	text-indent: -1rem;

	${p => p.active ?
		`&:before {
			position: absolute;
			content: '•';
		}` : ''
	}

	&:hover:before {
		position: absolute;
		content: '◦';
	}
	 
	& > .count {
		color: #999;
		font-size: .7rem;
		padding-left: .4rem;
	}
`

interface Props {
	active: boolean
	facetId: string
	facetsDataDispatch: React.Dispatch<FacetsDataReducerAction>
	keyFormatter?: (key: string | number) => string
	value: KeyCount
}

function ListFacetValueView(props: Props) {
	const handleChange = React.useCallback(() => {
		const type = props.active ? 'remove_filter' : 'add_filter'
		props.facetsDataDispatch({ type, facetId: props.facetId, value: props.value.key })

	}, [props.active, props.facetId, props.value.key])

	return (
		<Wrapper
			active={props.active}
			onClick={handleChange}
			title={props.value.key}
		>
			<span
				className="value"
				dangerouslySetInnerHTML={{ __html: props.keyFormatter(props.value.key) }}
			/>
			<span className="count">({props.value.count})</span>
		</Wrapper>

	)
}

ListFacetValueView.defaultProps = {
	// TODO use keyFormatter higher up the tree? now everytime the facet value is rendered,
	// the keyFormatter function is run
	keyFormatter: (value: string) => value.trim().length > 0 ? value : '<i>&lt;empty&gt;</i>'
}

export default React.memo(ListFacetValueView)
