import React from 'react'
import styled from 'styled-components'

import { ActiveFacsimile, Colors, Hit } from '@docere/common'

const FacsimileThumbList = styled.ul``

interface FTProps {
	active: boolean
	activeResult: boolean
}
const FacsimileThumb = styled.li`
	border: 3px solid ${(props: FTProps) => props.active ?
		`${Colors.Orange}${props.activeResult ? 'ff' : '88'}` :
		'white'
	};
	display: inline-block;
	padding: 2px;

	& > img {
		border-radius: .15em;
	}
`

const THUMB_WIDTH = 64

interface Props {
	activeFacsimile: ActiveFacsimile
	activeResult: boolean
	facsimiles: Hit['facsimiles'],
	small: boolean
}
export function FacsimileThumbs(props: Props) {
	if (props.facsimiles == null || !props.facsimiles.length) return null

	return props.facsimiles.length === 1 ?
		<img
			src={props.facsimiles[0].path.replace('info.json', `full/${THUMB_WIDTH},/0/default.jpg`)}
			width={`${THUMB_WIDTH}px`}
		/> :
		<FacsimileThumbList>
			{
				props.facsimiles.map((facs, index) => 
					<FacsimileThumb
						active={facs.id === props.activeFacsimile?.id}
						activeResult={props.activeResult}
						key={index}
					>
						<img
							src={facs.path.replace('info.json', `full/${(THUMB_WIDTH - 8)/2},/0/default.jpg`)} 
							width={`${(THUMB_WIDTH - 8)/2}px`}
						/>
					</FacsimileThumb>
				)
			}
		</FacsimileThumbList>
}
