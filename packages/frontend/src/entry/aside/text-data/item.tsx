import * as React from 'react'
import styled from 'styled-components'
import { small } from '../../index.components'

import type { EntryStateAction, Entity } from '@docere/common'
import ListFacetValue from '../metadata/list-value'

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
	const handleClick = React.useCallback(() => {
		props.entryDispatch({ type: 'SET_ENTITY', id: props.entity.id })
	}, [props.entity])

	return (
		<Li
			count={props.entity.count}
			onClick={handleClick}
		>
			<ListFacetValue
				metadataItem={props.entity}
			/>
		</Li>
	)
}
