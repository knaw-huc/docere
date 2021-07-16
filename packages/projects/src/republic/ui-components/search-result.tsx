import React from 'react'
import { ResultBody } from '@docere/ui-components'
import { StringMetadata } from '@docere/common'
// TODO fix StringMetadata export
console.log('SMD', StringMetadata)

import type { DocereResultBodyProps } from '@docere/common'

function RepublicResultBody(props: DocereResultBodyProps) {
	// console.log(props.result)
	return (
		<ResultBody {...props}>

			<div style={{ marginBottom: '1rem' }}>{new Date(Date.parse(props.result.session_date)).toDateString()}</div>
			<div>{props.result.session_weekday}</div>
			<div>{props.result.inventory_num}</div>
			<div>{props.result.president}</div>

			{/* <StringMetadata metadataId="session_weekday" value={props.result.session_weekday} />
			<StringMetadata metadataId="inventory_num" value={props.result.inventory_num} />
			<StringMetadata metadataId="president" value={props.result.president} /> */}
		</ResultBody>
	)
}

export const SearchResult = React.memo(RepublicResultBody)
