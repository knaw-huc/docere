import React from 'react'
import styled from 'styled-components'
import { ResultBody } from '@docere/ui-components'
import { StringMetadata } from '@docere/common'

import type { DocereResultBodyProps } from '@docere/common'


function RepublicResultBody(props: DocereResultBodyProps) {
	const date = new Date(Date.parse(props.result.date))
	const formattedDate = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`

	return (
		<ResultBody {...props}>
			<Datum>{formattedDate}</Datum>
			<StringMetadata metadataId="author" value={props.result.author} />
			<StringMetadata metadataId="addressee" value={props.result.addressee} />
			<StringMetadata metadataId="place" value={props.result.place} />
		</ResultBody>
	)
}

export const SearchResult = React.memo(RepublicResultBody)

const months = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
const days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']

const Datum = styled.div`
	font-weight: bold;
	font-size: .9rem;
	margin-bottom: 1rem;
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
