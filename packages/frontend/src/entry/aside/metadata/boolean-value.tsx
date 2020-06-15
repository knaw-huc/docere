import * as React from 'react'
import { SearchContext } from '@docere/search'

import Value from './list-facet/value'

import type { BooleanMetadata, BooleanFacetData } from '@docere/common'


interface Props {
	metadataItem: BooleanMetadata
}
export default function BooleanFacetValue(props: Props) {
	const searchContext = React.useContext(SearchContext)
	const { facets } = searchContext.state

	const handleSetSearchFilter = React.useCallback(ev => {
		ev.stopPropagation()

		const { facetId, value } = ev.currentTarget.dataset
		const type: 'ADD_FILTER' | 'SET_FILTER' | 'REMOVE_FILTER' = ev.currentTarget.dataset.type

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
			{facet?.config.labels[value.toString() as 'true' | 'false']}
		</Value>
	)
}
