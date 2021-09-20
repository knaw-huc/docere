import React from 'react'
import { ResultBody } from '@docere/ui-components'
import { StringMetadata } from '@docere/common'

import type { DocereResultBodyProps } from '@docere/common'
import styled from 'styled-components'


function RepublicResultBody(props: DocereResultBodyProps) {
	const date = new Date(Date.parse(props.result.session_date))

	return (
		<ResultBody {...props}>
			<H3>
				<span>{props.result.type}</span>
				<small>{props.result.session_weekday} {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</small>
			</H3>
			{/* <KeyValue name="resoluties" value={props.result.resolution_ids?.length} /> */}
			<StringMetadata metadataId="president" value={props.result.president} />
			<StringMetadata metadataId="attendant" value={props.result.attendant} />
			<StringMetadata metadataId="inventory_num" value={props.result.inventory_num} />
		</ResultBody>
	)
}

export const SearchResult = React.memo(RepublicResultBody)

const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

const H3 = styled.h3`
	margin: 0 0 1rem 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	text-transform: capitalize;

	small {
		font-size: .85rem;
		justify-self: right;
		align-self: center;
	}
`

// function KeyValue(props: { name: string, value: string | string[] }) {
// 	return (
// 		<KeyValueWrapper>
// 			<span>{props.name}</span>
// 			<span>{props.value}</span>
// 		</KeyValueWrapper>
// 	)
// }

// const KeyValueWrapper = styled.div`
// 	span:first-child {
// 		color: gray;
// 		padding-right: .5rem;
// 	}
// `
