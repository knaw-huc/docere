import * as React from 'react'
import { ResultBody } from '@docere/ui-components'
import type { DocereResultBodyProps } from '@docere/common'
import { StringMetadata } from '@docere/common'

function RepublicResultBody(props: DocereResultBodyProps) {
	// console.log(props.result)
	return (
		<ResultBody {...props}>
			{/* <StringMetadata metadataId="date" value={props.result.date} /> */}
			<div style={{ marginBottom: '1rem' }}>{new Date(Date.parse(props.result.date)).toDateString()}</div>
			<StringMetadata metadataId="session_weekday" value={props.result.session_weekday} />
			<StringMetadata metadataId="inventory_num" value={props.result.inventory_num} />
			<StringMetadata metadataId="president" value={props.result.president} />
		</ResultBody>
	)
}

export const SearchResult = React.memo(RepublicResultBody)
