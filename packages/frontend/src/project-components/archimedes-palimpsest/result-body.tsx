import * as React from 'react'
import styled from '@emotion/styled'
import getResultBody, { ResultBodyProps } from '../result-body'

const Label = styled.div`
	color: #888;
	font-size: .85em;
	text-transform: uppercase;
`

function MetadataItems(props: ResultBodyProps) {
	return (
		<>
			<div>
				<Label>ID</Label>
				<div>{props.result.id}</div>
			</div>
		</>
	)
}


export default getResultBody(MetadataItems)
