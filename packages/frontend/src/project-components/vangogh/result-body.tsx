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
				<Label>Date</Label>
				<div>{props.result.datelet}</div>
			</div>
			<div>
				<Label>Author</Label>
				<div>{props.result.author}</div>
			</div>
			<div>
				<Label>Addressee</Label>
				<div>{props.result.addressee}</div>
			</div>
			<div>
				<Label>Contents</Label>
				<div>{props.result.letcontents}</div>
			</div>
			<div>
				<Label>Place</Label>
				<div>{props.result.placelet}</div>
			</div>
		</>
	)
}


export default getResultBody(MetadataItems)
