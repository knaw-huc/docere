import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, TOP_OFFSET, MetadataItem } from '@docere/common'

import MetadataItemComp from './get-metadata-value'

import type { Entry } from '@docere/common'

interface WProps { active: boolean }
const Wrapper = styled.ul`
	box-sizing: border-box;
	height: calc(100vh - ${TOP_OFFSET}px);
	overflow-y: auto;
	padding: ${DEFAULT_SPACING}px;
	position: absolute;
	z-index: ${(p: WProps) => p.active ? 1 : -1};
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
`

interface Props extends WProps {
	metadata: Entry['metadata']
}
function MetadataAside(props: Props) {
	return (
		<Wrapper active={props.active}>
			{
				props.metadata
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
