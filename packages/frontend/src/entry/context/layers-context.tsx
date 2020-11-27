import React from 'react'
import { EntryContext, ID, StatefulLayer, LayersContext, LayersContextValue, isFacsimileLayer, isTextLayer, getTextPanelWidth, EntrySettings, EntitiesContextValue, DEFAULT_SPACING, EntrySettingsContext, EntitiesContext } from '@docere/common'

// TODO should updateLayers be depending on activeEntities? Everytime an entity changes
// the layers have to be re-rendered
function updateLayers(
	layers: LayersContextValue['layers'],
	settings: EntrySettings,
	entities: EntitiesContextValue['activeEntities']
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

export function LayersProvider(props: { children: React.ReactNode }) {
	const { entry } = React.useContext(EntryContext)
	const { settings } = React.useContext(EntrySettingsContext)
	const { activeEntities } = React.useContext(EntitiesContext)

	const [layers, setLayers] = React.useState<Map<ID, StatefulLayer>>(new Map())

	React.useEffect(() => {
		const l: [ID, StatefulLayer][] = entry.layers.map(l => ([l.id, l]))
		setLayers(updateLayers(new Map(l), settings, activeEntities))
	}, [entry])

	// React.useEffect(() => {
	// 	setLayers(updateLayers(layers, settings, activeEntities))
	// }, [settings, activeEntities])

	const pinLayer = React.useCallback((layerId: string) => {
		const layer = layers.get(layerId)
		layer.pinned = !layer.pinned
		layers.set(layerId, { ...layer })
		setLayers(updateLayers(layers, settings, activeEntities))
	}, [layers, settings, activeEntities])

	const activateLayer = React.useCallback((layerId: string) => {
		const layer = layers.get(layerId)
		layer.active = !layer.active
		layers.set(layerId, { ...layer })
		setLayers(updateLayers(layers, settings, activeEntities))
	}, [layers, settings, activeEntities])

	return (
		<LayersContext.Provider value={{ layers, pinLayer, activateLayer }}>
			{props.children}
		</LayersContext.Provider>
	) 
}
