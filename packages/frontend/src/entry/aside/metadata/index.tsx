import * as React from 'react'
import styled from 'styled-components'
import { DEFAULT_SPACING, TOP_OFFSET } from '@docere/common'

import MetadataItem from './get-metadata-value'

import type { AppStateAction, Entry } from '@docere/common'

interface WProps { active: boolean }
const Wrapper = styled.ul`
	box-sizing: border-box;
	height: calc(100vh - ${TOP_OFFSET}px);
	overflow-y: auto;
	padding: ${DEFAULT_SPACING}px;
	position: absolute;
	z-index: ${(p: WProps) => p.active ? 1 : -1}
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
`

interface Props extends WProps {
	appDispatch: React.Dispatch<AppStateAction>
	metadata: Entry['metadata']
}
function MetadataAside(props: Props) {
	return (
		<Wrapper active={props.active}>
			{
				props.metadata
					.map((data, index) =>
						<MetadataItem
							key={index}
							metadataItem={data}
						/>
					)
			}	
		</Wrapper>
	)
}

export default React.memo(MetadataAside)
