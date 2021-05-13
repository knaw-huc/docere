import React from "react"
import { ContainerType, ID, EntitiesContext, FacsimileContext } from '@docere/common'

function handleScroll(el: Element) {
	if (el == null) return
	// element.scrollIntoView does not work well in Chromium, that's why
	// the scroll position is calculated and used with scrollTo, which
	// does work. This workaround does require an extra data-scroll-container
	// attribute on the element which is scrollable (overflow: auto | scroll)
	const container = el.closest('[data-scroll-container]')
	const { height: containerHeight } = container.getBoundingClientRect()
	const { top: entityTop } = el.getBoundingClientRect()
	const top = (container.scrollTop + entityTop) - (containerHeight / 2)
	container.scrollTo({ top: top, behavior: 'smooth' })
}

export function useScrollFacsimileIntoView(ref: React.RefObject<HTMLElement>, containerType: ContainerType, containerId: ID) {
	const activeFacsimile = React.useContext(FacsimileContext)

	React.useEffect(() => {
		if (activeFacsimile == null) return
		// Don't scroll the container which caused the trigger. If the user
		// clicks an element, it's bad UX to move the clicked element
		if (
			activeFacsimile.triggerContainer === containerType &&
			activeFacsimile.triggerContainerId === containerId
		) return

		// Find the first element which represents the entity
		if (ref.current == null) return
		const el = ref.current.querySelector(`[data-facsimile-id="${activeFacsimile.props._facsimileId}"]`)
		if (el == null) {
			setTimeout(() => {
				const el = ref.current.querySelector(`[data-facsimile-id="${activeFacsimile.props._facsimileId}"]`)
				handleScroll(el)
			}, 300)
			return
		}
		
		handleScroll(el)
	}, [activeFacsimile, containerType, containerId])
}

export function useScrollEntityIntoView(ref: React.RefObject<HTMLElement>, containerType: ContainerType, containerId: ID) {
	const activeEntities = React.useContext(EntitiesContext)

	React.useEffect(() => {
		// Get the last active entity
		const es = Array.from(activeEntities)
		if (!es.length) return
		const [entityId, entity] = es[es.length - 1]

		// Don't scroll the container which caused the trigger. If the user
		// clicks an element, it's bad UX to move the clicked element
		if (
			entity.triggerContainer === containerType &&
			entity.triggerContainerId === containerId
		) return

		// Find the first element which represents the entity
		if (ref.current == null) return
		const el = ref.current.querySelector(`[data-entity-id="${entityId}"]`)
		if (el == null) return

		handleScroll(el)
	}, [activeEntities, containerType, containerId])
}
