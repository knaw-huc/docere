import React from "react"
import { ContainerContextValue, DispatchContext, FacsimileContext, ContainerType, Colors, ID, ElasticSearchFacsimile } from "@docere/common"
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
	facsimile: ElasticSearchFacsimile
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

	console.log(props.facsimile)
	if (props.facsimile.path == null) return null
	const src = props.facsimile.path.replace('/info.json', '/full/,32/0/default.jpg')
	const active = activeFacsimile?.props._facsimileId === props.facsimile.id

	return (
		<Img
			active={active}
			data-facsimile-id={props.facsimile.id}
			key={props.facsimile.id}
			onClick={onClick}
			ref={imgRef}
			src={src}
		/>
	)
}
