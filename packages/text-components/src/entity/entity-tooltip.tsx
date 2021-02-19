import React from "react"

import { ActiveEntities, DocereConfig, EntitiesContext, Entity, getTextPanelWidth, indexOfIterator, Tooltip } from '@docere/common'

interface Props {
	children: React.ReactNode
	entity: Entity
	settings: DocereConfig['entrySettings']
	zIndexOffset?: number
}
export function EntityTooltip(props: Props) {		
	const activeEntities = React.useContext(EntitiesContext)
	const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef()
	const offset = useOffset(activeEntities, props.settings, wrapperRef)

	return (
		<Tooltip
			color={props.entity.color}
			offset={offset}
			ref={wrapperRef}
			zIndexOffset={indexOfIterator(activeEntities, props.entity.id)}
		>
			{props.children}
		</Tooltip>
	)
}

function useOffset(
	activeEntities: ActiveEntities,
	settings: DocereConfig['entrySettings'],
	wrapperRef: React.RefObject<HTMLDivElement>
) {
	const [offset, setOffset] = React.useState(null)

	React.useEffect(() => {
		let offset = 0

		const textPanelRect = wrapperRef.current.closest('.text-panel').getBoundingClientRect()
		const tooltipRect = wrapperRef.current.getBoundingClientRect()

		const textPanelLeft = textPanelRect.left + 32
		if (tooltipRect.left < textPanelLeft) offset = textPanelLeft - tooltipRect.left

		const textPanelMiddle = textPanelRect.left + (textPanelRect.width / 2)
		const textPanelRight = textPanelMiddle + (getTextPanelWidth(settings, activeEntities) / 2) - 32
		if (tooltipRect.right > textPanelRight) offset = textPanelRight - tooltipRect.right

		setOffset(offset)
	}, [])

	return offset
}
