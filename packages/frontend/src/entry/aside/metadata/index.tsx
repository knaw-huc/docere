import React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, TOP_OFFSET, MetadataItem, EntryContext } from '@docere/common'

import { MetadataItemComp } from './get-metadata-value'

const Wrapper = styled.ul`
	box-sizing: border-box;
	height: calc(100vh - ${TOP_OFFSET}px);
	overflow-y: auto;
	padding: ${DEFAULT_SPACING}px;
	position: absolute;
	z-index: ${(p: Props) => p.active ? 1 : -1};
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
`

interface Props {
	active: boolean
}
function MetadataAside(props: Props) {
	const entry = React.useContext(EntryContext)
	return (
		<Wrapper active={props.active}>
			{
				Array.from(entry.metadata.values())
					.map((data: MetadataItem, index) =>
						<MetadataItemComp
							key={index}
							metadataItem={data}
						/>
					)
			}	
		</Wrapper>
	)
}

export default React.memo(MetadataAside)
