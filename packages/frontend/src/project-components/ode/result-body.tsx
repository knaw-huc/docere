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
			<div>
				<Label>IDNO</Label>
				<div>{props.result.idno}</div>
			</div>
			<div>
				<Label>Repository</Label>
				<div>{props.result.repository}</div>
			</div>
			<div>
				<Label>Settlement</Label>
				<div>{props.result.settlement}</div>
			</div>
			<div>
				<Label>Country</Label>
				<div>{props.result.country}</div>
			</div>
		</>
	)
}


export default getResultBody(MetadataItems)
