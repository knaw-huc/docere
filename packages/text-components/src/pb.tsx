import * as React from 'react'
import { Colors } from '@docere/common'
import styled from 'styled-components'

const Img = styled.img`
	position: absolute;
	left: 0;
	margin-top: 6px;
	padding-bottom: 6px;
	width: 32px;

	${(props: { active: boolean}) => props.active ?
		`border-bottom: 6px solid ${Colors.BrownLight};` :
		`cursor: pointer;

		&:hover {
			border-bottom: 6px solid ${Colors.BrownLight};
		}`
	}}
`

export default function getPb(extractPbId: (props: DocereComponentProps) => string): React.FC<DocereComponentProps> {
	return function Pb(props: DocereComponentProps) {
		const id = extractPbId(props)
		const facsimile = props.entry.facsimiles.find(f => f.id === id)
		if (facsimile == null) return null
		let src = facsimile.versions[0].path
		const active = props.activeFacsimile.id === id

		return (
			<span
				className="pb"
				onClick={() => {
					if (!active) props.entryDispatch({ type: 'SET_ACTIVE_FACSIMILE', id })
				}}
			>
				<Img
					active={active}
					src={src.slice(-10) === '/info.json' ? src.replace('/info.json', '/full/,32/0/default.jpg') : src}
				/>
			</span>
		)
	}
}
