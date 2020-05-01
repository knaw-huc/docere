import * as React from 'react'
import styled from 'styled-components'
import { small } from '../../index.components'

import type { EntryStateAction, Entity } from '@docere/common'
import MetadataValue from '../metadata/value'

const Li = styled.li`
	align-content: center;
	color: #CCC;
	cursor: pointer;
	display: grid;
	height: 48px;
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
		</Li>
	)
}

			{/* <div>{props.entity.value}</div>
			<div onClick={handleSetSearchFilter}>s</div> */}
