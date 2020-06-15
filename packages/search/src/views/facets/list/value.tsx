import React from 'react'
import styled from 'styled-components'

import type { KeyCount } from '@docere/common'
import SearchContext from '../../../facets-context'

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
	keyFormatter?: (key: string | number) => string
	value: KeyCount
}

function ListFacetValueView(props: Props) {
	const searchContext = React.useContext(SearchContext)
	const handleChange = React.useCallback(() => {
		const type = props.active ? 'REMOVE_FILTER' : 'ADD_FILTER'
		searchContext.dispatch({ type, facetId: props.facetId, value: props.value.key })

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

export default ListFacetValueView
