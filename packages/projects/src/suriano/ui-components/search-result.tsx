import * as React from 'react'
import { ResultBody } from '@docere/ui-components'
import type { DocereResultBodyProps } from '@docere/common'
import StringMetadata from '@docere/common/build/entry/metadata/string'

function SurianoResultBody(props: DocereResultBodyProps) {
	return (
		<ResultBody {...props}>
			<div style={{fontSize: '.75rem', marginBottom: '1rem' }}>{props.result.summary}</div>
			<StringMetadata metadataId="collection" value={props.result.collection} />
			<StringMetadata metadataId="institution" value={props.result.institution} />
			<StringMetadata metadataId="sender" value={props.result.sender} />
			<StringMetadata metadataId="sender_place" value={props.result.sender_place} />
			<StringMetadata metadataId="settlement" value={props.result.settlement} />
		</ResultBody>
	)
}

export const SearchResult = React.memo(SurianoResultBody)
