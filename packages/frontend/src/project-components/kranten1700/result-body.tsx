import * as React from 'react'
import styled from '@emotion/styled'
import getResultBody, { ResultBodyProps } from '../result-body'
import { Label } from '../generic-result-body'

const Div = styled.div`
	display: grid;
	grid-template-columns: 1fr 3fr;
`

function MetadataItems(props: ResultBodyProps) {
	return (
		<>
			<Div>
				<Label>ID</Label>
				<div>{props.result.id}</div>
			</Div>
			<Div>
				<Label>Artikel</Label>
				<div>{props.result.article_title}</div>
			</Div>
			<Div>
				<Label>Krant</Label>
				<div>{props.result.paper_title}</div>
			</Div>
			<Div>
				<Label>Date</Label>
				<div>{props.result.date}</div>
			</Div>
		</>
	)
}


export default getResultBody(MetadataItems)
