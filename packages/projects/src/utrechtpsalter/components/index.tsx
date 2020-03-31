import * as React from 'react'
import styled from 'styled-components'
import { DocereComponentContainer } from '@docere/common'
import type { DocereConfig, DocereComponentProps } from '@docere/common'

const Coords = styled.span`
	cursor: pointer;
`
export default function getComponents(_config: DocereConfig) {
	return async function(_container: DocereComponentContainer, _id: string) {
		return {
			block: styled.span`color: #444; margin-bottom: 1rem;`,
			text: styled.span`white-space: pre-wrap;`,
			coords: (props: DocereComponentProps) => {
				const { x, y, w, h } = props.attributes
				return (
					<Coords
						onClick={() =>
							props.entryDispatch({
								type: 'SET_ACTIVE_FACSIMILE_AREAS',
								ids: [x + y + w + h]
							})
						}
					>
						⚃
					</Coords>
				)
			},
		}
	}
}
