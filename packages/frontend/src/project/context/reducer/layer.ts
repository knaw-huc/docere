import { ProjectState, PinLayer, ToggleLayer, Layers, EntrySettings, ActiveEntities, isFacsimileLayer, isTextLayer, getTextPanelWidth, DEFAULT_SPACING } from '@docere/common'

export function pinLayer(state: ProjectState, action: PinLayer): ProjectState {
	const layer = state.layers.get(action.id)
	layer.pinned = !layer.pinned
	state.layers.set(action.id, { ...layer })

	return {
		...state,
		layers: updateLayers(state.layers, state.entrySettings, state.activeEntities)
	}
}

export function toggleLayer(state: ProjectState, action: ToggleLayer): ProjectState {
	const layer = state.layers.get(action.id)
	layer.active = !layer.active
	state.layers.set(action.id, { ...layer })

	return {
		...state,
		layers: updateLayers(state.layers, state.entrySettings, state.activeEntities)
	}
}

// TODO should updateLayers be depending on activeEntities? Everytime an entity changes
// the layers have to be re-rendered
export function updateLayers(
	layers: Layers,
	settings: EntrySettings,
	entities: ActiveEntities
) {
	const allLayers = Array.from(layers.values())
	const activeLayers = allLayers.filter(l => l.active)
	const hasFacsimile = activeLayers.some(l => l.active && isFacsimileLayer(l) && !l.pinnable)

	layers
		.forEach(layer => {
			if (!layer.active) return layer

			const width = isTextLayer(layer) ?
				getTextPanelWidth(settings, entities) :
				DEFAULT_SPACING * 10

			const columnWidth = isTextLayer(layer) ?
				(hasFacsimile || layer.pinned) ? `${width}px` : `minmax(${width}px, 1fr)` :
				`minmax(${width}px, auto)`

			const pinnable = activeLayers.length > 2 || layer.pinned

			// If column width or pinnable change, create a new layer object
			if (layer.columnWidth !== columnWidth || layer.pinnable !== pinnable) {
				// hasChange = true
				layers.set(layer.id, {
					...layer,
					columnWidth,
					pinnable,
					width,
				})
			}
		})

	// return hasChange ? new Map(nextLayers) : nextLayers
	return new Map(layers)
}
