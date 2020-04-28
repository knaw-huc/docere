import * as React from 'react'
import styled from 'styled-components'
import { small } from '../../index.components'

import type { EntryStateAction, Entity } from '@docere/common'
// import { SearchContext } from '@docere/search_'
import MetadataValue from '../metadata/value'

const Li = styled.li`
	color: #CCC;
	cursor: pointer;
	display: grid;
	grid-template-columns: 4fr 1fr;
	height: 48px;
	line-height: 48px;
	padding-left: 1em;

	&:after {
		${small}
		color: #777;
		content: ${(props: { count: number }) => props.count > 1 ? `"(${props.count})"` : ''};
	}
`

interface Props {
	active: boolean
	entryDispatch: React.Dispatch<EntryStateAction>
	entity: Entity
}
export default function ItemInText(props: Props) {
	// const searchContext = React.useContext(SearchContext)

	const handleClick = React.useCallback(() => {
		props.entryDispatch({ type: 'SET_ENTITY', id: props.entity.id })
	}, [props.entity])

	// const handleSetSearchFilter = React.useCallback(() => {
	// 	searchContext.dispatch({ type: 'SET_SEARCH_FILTER', facetId: props.entity.type, value: props.entity.value })
	// }, [props.entity])

	return (
		<Li
			count={props.entity.count}
			onClick={handleClick}
		>
			<MetadataValue
				facetId={props.entity.type}
				value={props.entity.value}
			/>
			{/* <div>{props.entity.value}</div>
			<div onClick={handleSetSearchFilter}>s</div> */}
		</Li>
	)
}
