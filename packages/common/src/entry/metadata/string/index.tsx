import React from 'react'

import { ListFacetData, SearchContext } from '../../..'
import { MetadataWrapper } from '../wrapper'
import Value from './value'

interface Props {
	metadataId: string
	value: string | string[]
}
export function StringMetadata(props: Props) {
	const searchContext = React.useContext(SearchContext)
	const { facets } = searchContext.state

	const facet = facets.get(props.metadataId)
	if (facet == null) return null

	const filters = facet?.filters as ListFacetData['filters']

	return (
		<MetadataWrapper title={facet.config.title}>
			{
				(
					props.value == null ||
					props.value.length === 0
				) ?
					'-' :
					Array.isArray(props.value) ?
						props.value.map(v =>
							<Value
								active={filters?.has(v)}
								id={props.metadataId}
								key={`${props.metadataId}${v}`}
								value={v}
							/>
						) :
						<Value
							active={filters?.has(props.value)}
							id={props.metadataId}
							value={props.value}
						/>
			}
		</MetadataWrapper>
	)
}
