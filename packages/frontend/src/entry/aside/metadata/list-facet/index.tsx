import * as React from 'react'
import { SearchContext } from '@docere/search_'

import Value from './value'

import type { Entity, ListMetadata, ListFacetData } from '@docere/common'

interface Props {
	metadataItem: ListMetadata | Entity
}
export default function ListFacetValue(props: Props) {
	const searchContext = React.useContext(SearchContext)
	const { facets } = searchContext.state

	const handleSetSearchFilter = React.useCallback(ev => {
		ev.stopPropagation()

		const { facetId, value } = ev.currentTarget.dataset
		const type: 'ADD_SEARCH_FILTER' | 'SET_SEARCH_FILTER' | 'REMOVE_SEARCH_FILTER' = ev.currentTarget.dataset.type

		searchContext.dispatch({
			type,
			facetId,
			value
		})
	}, [])

	const { id, value } = props.metadataItem

	const filters = facets.get(id)?.filters as ListFacetData['filters']

	return Array.isArray(value) ?
		<>
			{
				value.length === 0 ?
				'-' :
				value.map(v =>
					<Value
						active={filters?.has(v)}
						id={id}
						key={`${id}${v}`}
						onClick={handleSetSearchFilter}
					>
						{v}
					</Value>
				)
			}
		</> :
		<Value
			active={filters?.has(value)}
			id={id}
			onClick={handleSetSearchFilter}
		>
			{value}
		</Value>
}
