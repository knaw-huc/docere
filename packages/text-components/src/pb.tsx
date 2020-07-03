import * as React from 'react'
import { Colors, DEFAULT_SPACING } from '@docere/common'
import type { DocereComponentProps } from '@docere/common'
import styled from 'styled-components'

const Wrapper = styled.span`
	& > div {
		display: grid;
		left: ${DEFAULT_SPACING}px;
		position: absolute;
	}
`

const Img = styled.img`
	border: 3px solid rgba(0, 0, 0, 0);
	margin-top: 6px;
	padding: 2px;
	width: 32px;

	${(props: { active: boolean}) => props.active ?
		`border: 3px solid ${Colors.Orange};` :
		`cursor: pointer;

		&:hover {
			border: 3px solid ${Colors.Orange}88;
		}`
	}}
`

export default function getPb(extractPbId: (props: DocereComponentProps) => string | string[]): React.FC<DocereComponentProps> {
	return function Pb(props: DocereComponentProps) {
		if (
			!props.entrySettings['panels.text.showPageBeginnings'] ||
			props.entry.facsimiles == null
		) return null

		let ids = extractPbId(props)
		if (ids == null) return null
		if (!Array.isArray(ids)) ids = [ids]

		const facsimiles = ids
			.map(id => props.entry.facsimiles.find(f => f.id === id))
			.filter(facsimile => facsimile != null)

		return (
			<Wrapper>
				<div>
					{
						facsimiles.map(facsimile => {
							const src = facsimile.versions[0].path
							const active = props.activeFacsimile?.id === facsimile.id
							return (
								<Img
									active={active}
									key={facsimile.id}
									onClick={() => {
										if (!active) props.entryDispatch({ type: 'SET_ACTIVE_FACSIMILE', id: facsimile.id })
									}}
									src={src.slice(-10) === '/info.json' ? src.replace('/info.json', '/full/,32/0/default.jpg') : src}
								/>
							)
						})
					}
				</div>
			</Wrapper>
		)
	}
}
