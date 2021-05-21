import * as React from 'react'

import Value from './list-facet/value'

import { BooleanMetadata, BooleanFacetData, SearchContext } from '@docere/common'


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

	const { value } = props.metadataItem
	const { id } = props.metadataItem.config

	const facet = facets.get(id) as BooleanFacetData
	const filters = facet?.filters

	return (
		<Value
			active={filters?.has(value.toString())}
			id={id}
			onClick={handleSetSearchFilter}
		>
			{facet?.config.facet.labels[value.toString() as 'true' | 'false']}
		</Value>
	)
}
