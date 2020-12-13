import React from 'react'
import { Colors, DEFAULT_SPACING, Facsimile, EntrySettingsContext, EntryContext, FacsimileContext, ComponentProps, DispatchContext, ContainerType, ContainerContext, ContainerContextValue } from '@docere/common'
import styled from 'styled-components'

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

const ThumbWrapper = styled.div`
	${(props: { multiple: boolean }) =>
		props.multiple ?
			`display: grid;` :
			''
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

export function Pb(props: ComponentProps) {
	const settings = React.useContext(EntrySettingsContext)
	const container = React.useContext(ContainerContext)
	const facsimiles = useFacsimiles(props.attributes['docere:id'])

	if (
		!settings['panels.text.showPageBeginnings'] ||
		!facsimiles.length
	) return null

	return (
		<Wrapper>
			<div>
				<ThumbWrapper multiple={facsimiles.length > 1}>
					{
						facsimiles.map(facsimile =>
							<FacsimileThumb
								facsimile={facsimile}
								key={facsimile.id}
								container={container}
							/>	
						)
					}
				</ThumbWrapper>
			</div>
		</Wrapper>
	)
}

interface FacsimileThumbProps {
	facsimile: Facsimile
	container: ContainerContextValue
}
function FacsimileThumb(props: FacsimileThumbProps) {
	const dispatch = React.useContext(DispatchContext)
	const activeFacsimile = React.useContext(FacsimileContext)

	const imgRef = React.useRef<HTMLImageElement>()

	const onClick = React.useCallback((ev) => {
		const { facsimileId } = ev.target.dataset
		dispatch({
			type: 'SET_FACSIMILE',
			facsimileId,
			triggerContainer: ContainerType.Layer,
			triggerContainerId: props.container.id,
		})
	}, [props.container])

	const version = props.facsimile.versions[0]
	const src = version.thumbnailPath != null ? version.thumbnailPath : version.path
	const active = activeFacsimile?.id === props.facsimile.id

	React.useEffect(() => {
		if (!active) return

		if (
			activeFacsimile.triggerContainer != null && // this happens when the page loads. only scroll when triggerlayer is actively set
			(
				activeFacsimile.triggerContainer !== ContainerType.Layer ||
				activeFacsimile.triggerContainerId !== props.container.id
			)
		) {
			setTimeout(() => {
				imgRef.current.scrollIntoView({ behavior: 'smooth' })
			}, 0)
		}
	}, [active, activeFacsimile])

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
