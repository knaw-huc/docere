import React from 'react'
import styled from 'styled-components'

import DropDown from '../../../ui/drop-down'
import OrderOption from './option'

import { SearchContext, SearchPropsContext, SetSortOrder, SortOrder } from '@docere/common'

const SortByDropDown = styled(DropDown)`
	& > .huc-fs-dropdown-button {
		height: 46px;
	}

	& > .huc-fs-dropdown-body {
		left: 32px;
		width: 240px;
	}
`

interface Props {
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function SortBy(props: Props) {
	const { state } = React.useContext(SearchContext)
	const { i18n } = React.useContext(SearchPropsContext)

	const label = (props.sortOrder.size > 0) ?
		`${i18n.sort_by} (${props.sortOrder.size})` :
		i18n.sort_by

	return (
		<SortByDropDown
			label={label}
			z={998}
		>
			{
				Array.from(state.facets.values())
					.sort((facetData1, facetData2) => {
						const a = props.sortOrder.has(facetData1.config.id)
						const b = props.sortOrder.has(facetData2.config.id)

						if (a === b) {
							const order1 = facetData1.config.facet.order
							const order2 = facetData2.config.facet.order
							return order1 - order2
						}

						return a ? -1 : 1
					})
					.map(facetState =>
						<OrderOption
							facetData={facetState}
							key={facetState.config.id}
							sortOrder={props.sortOrder}
							setSortOrder={props.setSortOrder}
						/>
					)
			}
		</SortByDropDown>
	)
}

export default React.memo(SortBy)
