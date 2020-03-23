import * as React from 'react'
import OrderOption from './option'
import DropDown from '../../ui/drop-down'
import styled from 'styled-components'

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
					.sort((field1, field2) => {
						const a = props.sortOrder.has(field1.id)
						const b = props.sortOrder.has(field2.id)
						if (a === b) return field1.order - field2.order
						return a ? -1 : 1
					})
					.map(field =>
						<OrderOption
							facetData={field}
							key={field.id}
							sortOrder={props.sortOrder}
							setSortOrder={props.setSortOrder}
						/>
					)
			}
		</SortByDropDown>
	)
}

export default React.memo(SortBy)
