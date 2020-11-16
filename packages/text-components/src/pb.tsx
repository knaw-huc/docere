import React from 'react'
import { Colors, DEFAULT_SPACING, Facsimile, EntrySettingsContext, EntryContext, FacsimileContext } from '@docere/common'
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

function useFacsimiles(ids: string) {
	const entry = React.useContext(EntryContext)
	const [facsimiles, setFacsimiles] = React.useState<Facsimile[]>([])

	React.useEffect(() => {
		if (ids == null) return

		const _facsimiles = ids.split(' ')
			.map(id => entry.textData.facsimiles.get(id))
			.filter(x => x != null)

		setFacsimiles(_facsimiles)
	}, [entry, ids])

	return facsimiles
}

export function Pb(props: DocereComponentProps) {
	const { settings } = React.useContext(EntrySettingsContext)
	const facsimiles = useFacsimiles(props.attributes['docere:id'])

	console.log(props.attributes['docere:id'])

	if (
		!settings['panels.text.showPageBeginnings'] ||
		props.layer.facsimiles == null
	) return null

	return (
		<Wrapper>
			<div>
				{
					facsimiles.map(facsimile =>
						<FacsimileThumb
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

interface FacsimileThumbProps {
	facsimile: Facsimile
	layer: DocereComponentProps['layer']
}
function FacsimileThumb(props: FacsimileThumbProps) {
	const { activeFacsimile, setActiveFacsimile } = React.useContext(FacsimileContext)

	const imgRef = React.useRef<HTMLImageElement>()

	const onClick = React.useCallback((ev) => {
		const { facsimileId } = ev.target.dataset
		setActiveFacsimile(facsimileId, props.layer.id, null)
	}, [props.layer])

	const version = props.facsimile.versions[0]
	const src = version.thumbnailPath != null ? version.thumbnailPath : version.path
	const active = activeFacsimile.id === props.facsimile.id

	React.useEffect(() => {
		if (
			active &&
			activeFacsimile.triggerLayerId !== props.layer.id &&
			activeFacsimile.triggerLayerId != null // this happens when the page loads. only scroll when triggerlayer is actively set
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
