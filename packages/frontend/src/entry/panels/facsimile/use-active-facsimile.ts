import React from 'react'
import { FacsimileContext, EntryContext, EntitiesContext } from '@docere/common'

import { AreaRenderer } from './use-area-renderer'
import { formatTileSource } from './utils'

/**
 * Add the current active facsimile to OpenSeadragon. After opening,
 * render the facsimile areas on the SVG overlay. When activeEntities
 * change, activate the corresponding area.
 * 
 * @param areaRenderer 
 * @param osd 
 */
export function useActiveFacsimile(
	areaRenderer: AreaRenderer,
	osd: any
) {
	const activeFacsimile = React.useContext(FacsimileContext)
	const entry = React.useContext(EntryContext)
	const activeEntities = React.useContext(EntitiesContext)
	const [areasRendered, setAreasRendered] = React.useState(false)

	// useEffect triggered when entry or activeFacsimile changes.
	// after async loading of the facsimile, the areas are rendered.
	React.useEffect(() => {
		if (areaRenderer == null || activeFacsimile == null || osd == null) return

		function openHandler() {
			areaRenderer.render(entry, activeFacsimile)
			setAreasRendered(true)
			osd.removeHandler('open', openHandler)
		}

		osd.addHandler('open', openHandler)

		osd.open(formatTileSource(activeFacsimile))
	}, [areaRenderer, entry, activeFacsimile])

	// Activate areas when activeEntities change
	React.useEffect(() => {
		if (areaRenderer == null) return

		areaRenderer.activate(activeEntities)
	}, [activeEntities, areaRenderer])

	// Extra check to activate areas after the areas have been rendered,
	// because area rendering is async (after loading the facsimile).
	// The 'normal' useEffect for activating the areas has already been
	// triggered before the rendering is finished, therefor an extra trigger
	// is needed
	React.useEffect(() => {
		if (areaRenderer == null) return

		if (areasRendered) {
			areaRenderer.activate(activeEntities)
			setAreasRendered(false)
		}
	}, [activeEntities, areaRenderer, areasRendered])
}
