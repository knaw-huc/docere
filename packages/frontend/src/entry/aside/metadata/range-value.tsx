import React from 'react'
import { SearchContext } from '../../../../../search/src'

import Value from './list-facet/value'

import type { RangeMetadata, /* RangeFacetData */ } from '@docere/common'


interface Props {
	metadataItem: RangeMetadata
}
export default function RangeFacetValue(props: Props) {
	const searchContext = React.useContext(SearchContext)

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

	return (
		<Value
			active={true}
			id={id}
			onClick={handleSetSearchFilter}
		>
			{value}
		</Value>
	)
}
