import React from 'react'
import { Colors, DEFAULT_SPACING, Facsimile } from '@docere/common'
import styled from 'styled-components'

import type { DocereComponentProps } from '@docere/common'

// TODO changed display from grid to inline, which breaks multiple 
// facsimiles in one PB. For a fix: add a container div with a grid,
// instead of directly on the wrapper. If the wrapper is not inline,
// it will not align well with the inline <pb> in the text
const Wrapper = styled.span`
	& > div {
		display: inline;
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
	const [facsimiles, setFacsimiles] = React.useState<Facsimile[]>([])

	React.useEffect(() => {
		let ids = extractPbId(props)
		if (ids == null) return
		if (!Array.isArray(ids)) ids = [ids]

		const _facsimiles = ids
			.map(id => props.layer.facsimiles.find(f => f.id === id))
			.filter(facsimile => facsimile != null)

		setFacsimiles(_facsimiles)
	}, [props.entry.id])

	return facsimiles
}


export default function getPb(extractPbId: ExtractPbId): React.FC<DocereComponentProps> {
	return function Pb(props: DocereComponentProps) {
		if (
			!props.entrySettings['panels.text.showPageBeginnings'] ||
			props.layer.facsimiles == null
		) return null

		const facsimiles = useFacsimiles(extractPbId, props)

		const onClick = React.useCallback((ev) => {
			const { facsimileId } = ev.target.dataset

			// TODO is if necessary?
			if (!props.activeFacsimiles.has(facsimileId)) {
				props.entryDispatch({
					id: facsimileId,
					triggerLayer: props.layer,
					type: 'SET_FACSIMILE',
				})
			}
		}, [props.activeFacsimiles, props.layer])

		return (
			<Wrapper>
				<div>
					{
						facsimiles.map(facsimile => {
							const src = facsimile.versions[0].path
							const active = props.activeFacsimiles.has(facsimile.id)
							return (
								<Img
									active={active}
									data-facsimile-id={facsimile.id}
									key={facsimile.id}
									onClick={onClick}
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
