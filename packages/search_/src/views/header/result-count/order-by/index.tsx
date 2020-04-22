import React from 'react'
import styled from 'styled-components'

import OrderOption from './option'
import DropDown from '../../../ui/drop-down'

import type { FacetsData, SetSortOrder, SortOrder } from '@docere/common'

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
	facetsData: FacetsData
	setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
function SortBy(props: Props) {
	let label = 'sort by'
	if (props.sortOrder.size > 0) label += ` (${props.sortOrder.size})` 

	return (
		<SortByDropDown
			label={label}
			z={998}
		>
			{
				Array.from(props.facetsData.values())
					.sort((facetData1, facetData2) => {
						const a = props.sortOrder.has(facetData1.config.id)
						const b = props.sortOrder.has(facetData2.config.id)

						if (a === b) {
							const order1 = facetData1.config.order
							const order2 = facetData2.config.order
							return order1 - order2
						}

						return a ? -1 : 1
					})
					.map(facetData =>
						<OrderOption
							facetData={facetData}
							key={facetData.config.id}
							sortOrder={props.sortOrder}
							setSortOrder={props.setSortOrder}
						/>
					)
			}
		</SortByDropDown>
	)
}

export default React.memo(SortBy)
