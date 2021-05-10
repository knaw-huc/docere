import React from 'react'
import styled from 'styled-components'

import { ActiveFacsimile, ContainerType, Hit, ID } from '@docere/common'
import { FacsimileThumb } from './facsimile-thumb'

const FacsimileThumbList = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-auto-rows: min-content;
`

interface Props {
	activeFacsimile: ActiveFacsimile
	activeResult: boolean
	entryId: ID
	facsimiles: Hit['facsimiles'],
	small: boolean
}
export function FacsimileThumbs(props: Props) {
	if (props.facsimiles == null || !props.facsimiles.length) return null

	return (
		<FacsimileThumbList>
			{
				props.facsimiles.map((facs, index) => 
					<FacsimileThumb
						container={{
							type: ContainerType.Search,
							id: null
						}}
						entryId={props.entryId}
						facsimile={facs}
						key={index}
					/>
				)
			}
		</FacsimileThumbList>
	)
}
