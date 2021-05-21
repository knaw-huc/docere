import * as React from 'react'
import styled from 'styled-components'

import Value from './list-facet/value'

import { HierarchyMetadata, FacetsData, HierarchyFacetData, SearchContext } from '@docere/common'

const Ul = styled.ul`
	ul {
		margin-left: 1em;
		position: relative;

		&:before {
			content: '⌞';
			position: absolute;
			top: -.8em;
			left: -.7em;
			color: #666;
		}
	}
`

interface HierarchyValueProps {
	id: string
	facets: FacetsData
	onClick: (ev: any) => void
	value: HierarchyMetadata['value']
}
export function HierarchyValue(props: HierarchyValueProps) {
	const { facets, id, onClick } = props
	const [v, ...rest] = props.value
	const filters = facets.get(id)?.filters as HierarchyFacetData['filters']

	return (
		<Ul>
			<li>
				<Value
					active={filters?.has(v)}
					id={id}
					key={`${id}${v}`}
					onClick={onClick}
				>
					{v}
				</Value>
				{
					rest.length > 0 &&
					<HierarchyValue
						{...props}
						value={rest}
					/>
				}
			</li>
		</Ul>
	)
}


interface Props {
	metadataItem: HierarchyMetadata
}
export default function HierarchyFacetValue(props: Props) {
	const searchContext = React.useContext(SearchContext)
	const { facets } = searchContext.state

	const handleSetSearchFilter = React.useCallback(ev => {
		ev.stopPropagation()

		const { dataset } = ev.currentTarget
		const type: 'ADD_FILTER' | 'SET_FILTER' | 'REMOVE_FILTER' = dataset.type


		const value = type !== 'REMOVE_FILTER' ?
			props.metadataItem.value.slice(0, props.metadataItem.value.indexOf(dataset.value) + 1) :
			dataset.value

		searchContext.dispatch({
			type,
			facetId: dataset.facetId,
			value,
		})
	}, [])

	return (
		<HierarchyValue
			facets={facets}
			id={props.metadataItem.config.id}
			onClick={handleSetSearchFilter}
			value={props.metadataItem.value}
		/>
	)
}
