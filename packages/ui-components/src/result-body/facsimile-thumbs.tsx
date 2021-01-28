import React from 'react'
import styled from 'styled-components'

import type { Hit } from '@docere/common'

const FacsimileThumbList = styled.ul`
	& > li:nth-of-type(odd) {
		margin-right: 8px;
	}
`

const FacsimileThumb = styled.li`
	display: inline-block;
	margin-bottom: 8px;

	& > img {
		border-radius: .15em;
	}
`

const THUMB_WIDTH = 64

export function FacsimileThumbs(props: { facsimiles: Hit['facsimiles'], small: boolean }) {
	if (props.facsimiles == null || !props.facsimiles.length) return null

	return props.facsimiles.length === 1 ?
		<img
			src={props.facsimiles[0].path.replace('info.json', `full/${THUMB_WIDTH},/0/default.jpg`)}
			width={`${THUMB_WIDTH}px`}
		/> :
		<FacsimileThumbList>
			{
				props.facsimiles.map((facs, index) => 
					<FacsimileThumb key={index}>
						<img
							src={facs.path.replace('info.json', `full/${(THUMB_WIDTH - 8)/2},/0/default.jpg`)} 
							width={`${(THUMB_WIDTH - 8)/2}px`}
						/>
					</FacsimileThumb>
				)
			}
		</FacsimileThumbList>
}
