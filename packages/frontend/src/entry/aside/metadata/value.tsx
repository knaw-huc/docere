import * as React from 'react'
import styled from 'styled-components'
import { Colors } from '@docere/common'

const Wrapper = styled.span`
	${(props: Props) => 
		props.active ?
			`
			&:${props.flip ? 'before' : 'after'} {
				color: ${Colors.Orange};
				content: '◎';
				padding: 0 .5em;
			}
			` :
			''
	}
`

interface Props {
	active: boolean
	children: React.ReactNode
	className?: string
	flip?: boolean
}
export default function MetadataValue(props: Props) {
	return (
		<Wrapper
			active={props.active}
			className={props.className}
			flip={props.flip}
		>
			{props.children}
		</Wrapper>
	)
}
