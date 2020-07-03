import * as React from 'react'
import styled from 'styled-components'
import { ResultBody } from '@docere/ui-components'
import type { DocereResultBodyProps } from '@docere/common'

const Bold = styled.div`
	font-weight: bold;
	margin-bottom: .5rem;

	& > span {
		color: #888;
		font-weight: normal;
	}
`

const Small = styled.ul`
	color: #666;
	font-size: .8rem;
	margin-bottom: .5rem;
`

const Normal = styled.ul`
	margin-bottom: .5rem;
`

function VanGoghResultBody(props: DocereResultBodyProps) {
	return (
		<ResultBody {...props}>
			<Bold>
				<span>From </span>
				{props.result.author}
				<span> to </span>
				{props.result.addressee}
			</Bold>
			<Normal>{props.result.datelet}</Normal>
			<Small>{props.result.letcontents}</Small>
		</ResultBody>
	)
}


export default React.memo(VanGoghResultBody)
