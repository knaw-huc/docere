import React from 'react'
import { Colors, DEFAULT_SPACING, Entry } from '@docere/common'
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

type ExtractPbId = (props: DocereComponentProps) => string | string[]

function useFacsimiles(extractPbId: ExtractPbId, props: DocereComponentProps) {
	const [facsimiles, setFacsimiles] = React.useState<Entry['facsimiles']>([])

	React.useEffect(() => {
		let ids = extractPbId(props)
		if (ids == null) return
		if (!Array.isArray(ids)) ids = [ids]

		const _facsimiles = ids
			.map(id => props.entry.facsimiles.find(f => f.id === id))
			.filter(facsimile => facsimile != null)

		setFacsimiles(_facsimiles)
	}, [props.entry.id])

	return facsimiles
}


export default function getPb(extractPbId: ExtractPbId): React.FC<DocereComponentProps> {
	return function Pb(props: DocereComponentProps) {
		if (
			!props.entrySettings['panels.text.showPageBeginnings'] ||
			props.entry.facsimiles == null
		) return null

		const facsimiles = useFacsimiles(extractPbId, props)

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
