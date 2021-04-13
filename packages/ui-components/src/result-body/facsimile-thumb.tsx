import React from "react"
import { Facsimile, ContainerContextValue, DispatchContext, FacsimileContext, ContainerType, Colors, ID } from "@docere/common"
import styled from "styled-components"

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

interface FacsimileThumbProps {
	entryId?: ID
	facsimile: Facsimile
	container: ContainerContextValue
}
export function FacsimileThumb(props: FacsimileThumbProps) {
	const dispatch = React.useContext(DispatchContext)
	const activeFacsimile = React.useContext(FacsimileContext)

	const imgRef = React.useRef<HTMLImageElement>()

	const onClick = React.useCallback((ev) => {
		ev.stopPropagation()
		const { facsimileId } = ev.target.dataset
		dispatch({
			entryId: props.entryId,
			facsimileId,
			triggerContainer: ContainerType.Layer,
			triggerContainerId: props.container.id,
			type: 'SET_FACSIMILE',
		})
	}, [props.container, props.entryId])

	const version = props.facsimile.versions[0]
	const src = version.thumbnailPath != null ? version.thumbnailPath : version.path
	const active = activeFacsimile?.id === props.facsimile.id

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
