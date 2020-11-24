import React from 'react'
import styled from 'styled-components'
import { Lb, Pb } from '@docere/text-components'

import type { DocereConfig, ComponentProps } from '@docere/common'

const ColumnWrapper = styled.div`
	margin-bottom: 1rem;
`

function Column(props: ComponentProps) {
	return (
		<ColumnWrapper>
			<Pb {...props} />	
			{props.children}
		</ColumnWrapper>
	)
}

export default function (_config: DocereConfig) {
	return {
		TextLine: styled.div``,
		TextRegion: styled.div``,
		column: Column,
		line: Lb,
	}
}
