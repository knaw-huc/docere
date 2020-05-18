import * as React from 'react'
import styled, { css } from 'styled-components'
import { ResultBody } from '@docere/ui-components'
import type { DocereResultBodyProps } from '@docere/common'

const Bold = styled.div`
	font-weight: bold;
	margin-bottom: .5rem;

	& > span {
		color: #888;
		font-weight: normal;
		margin: 0 .5rem;
	}
`

function GekaapteBrievenResultBody(props: DocereResultBodyProps) {
	return (
		<ResultBody {...props}>
			<Bold>
				{props.result.access_level0}
				<span>></span>
				{props.result.access_level1}
				<span>></span>
				{props.result.access_level2}
				<span>></span>
				{props.result.setId}
			</Bold>
		</ResultBody>
	)
}


export default React.memo(GekaapteBrievenResultBody)
