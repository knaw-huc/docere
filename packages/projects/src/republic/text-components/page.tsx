import React from 'react'
import { DocereConfig, DocereComponentProps } from '@docere/common';
import styled from 'styled-components';
import { Lb, Pb } from '@docere/text-components';

const ColumnWrapper = styled.div`
	margin-bottom: 1rem;
`

function Column(props: DocereComponentProps) {
	// const Pb = getPb(props => props.attributes.facs)

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
