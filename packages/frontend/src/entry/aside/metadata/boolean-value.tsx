import * as React from 'react'
import { SearchContext } from '@docere/search_'

import Value from './value'

import type { BooleanMetadata, BooleanFacetData } from '@docere/common'


interface Props {
	metadataItem: BooleanMetadata
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

	const facet = facets.get(id) as BooleanFacetData
	const filters = facet?.filters

	return (
		<Value
			active={filters?.has(value.toString())}
			id={id}
			onClick={handleSetSearchFilter}
		>
			{facet?.config.labels[value]}
		</Value>
	)
}
