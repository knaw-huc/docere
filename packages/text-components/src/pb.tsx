import React from 'react'
import { Colors, DEFAULT_SPACING, Facsimile, EntryState } from '@docere/common'
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
			.map(id => props.entry.textData.facsimiles.get(id))
			.filter(x => x != null)

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

		return (
			<Wrapper>
				<div>
					{
						facsimiles.map(facsimile =>
							<FacsimileThumb
								activeFacsimiles={props.activeFacsimiles}
								entryDispatch={props.entryDispatch}
								facsimile={facsimile}
								key={facsimile.id}
								layer={props.layer}
							/>	
						)
					}
				</div>
			</Wrapper>
		)
	}
}

interface FacsimileThumbProps {
	activeFacsimiles: EntryState['activeFacsimiles']
	entryDispatch: DocereComponentProps['entryDispatch'] 
	facsimile: Facsimile
	layer: DocereComponentProps['layer']
}
function FacsimileThumb(props: FacsimileThumbProps) {
	const imgRef = React.useRef<HTMLImageElement>()

	const onClick = React.useCallback((ev) => {
		const { facsimileId } = ev.target.dataset

		props.entryDispatch({
			id: facsimileId,
			layerId: null,
			triggerLayerId: props.layer.id,
			type: 'SET_FACSIMILE',
		})
	}, [props.layer])

	const src = props.facsimile.versions[0].path
	const active = props.activeFacsimiles.has(props.facsimile.id)

	React.useEffect(() => {
		if (
			active &&
			props.activeFacsimiles.get(props.facsimile.id).triggerLayerId !== props.layer.id
		) {
			setTimeout(() => {
				imgRef.current.scrollIntoView({ behavior: 'smooth' })
			}, 0)
		}
	}, [active])

	return (
		<Img
			active={active}
			data-facsimile-id={props.facsimile.id}
			key={props.facsimile.id}
			onClick={onClick}
			ref={imgRef}
			src={src.slice(-10) === '/info.json' ? src.replace('/info.json', '/full/,32/0/default.jpg') : src}
		/>
	)
}
