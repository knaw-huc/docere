import * as React from 'react'
import { ProjectContext, isTextLayer, AsideTab, getTextPanelWidth, LayerType, DEFAULT_SPACING, defaultEntrySettings, useUrlObject, useEntry, useNavigate, createLookup, Layer } from '@docere/common'

import type { EntryState, EntryStateAction } from '@docere/common'

const initialEntryState: EntryState = {
	activeEntities: null,
	asideTab: null,
	entrySettings: defaultEntrySettings,
	projectConfig: null,
	entry: null,
	layers: [],
	lookup: {
		facsimiles: {},
		entities: {},
	}
}

function entryStateReducer(entryState: EntryState, action: EntryStateAction): EntryState {
	if ((window as any).DEBUG) console.log('[EntryState]', action)

	const { type, ...payload } = action
	switch (action.type) {
		case 'PROJECT_CHANGED': {
			return {
				...entryState,
				entrySettings: action.config.entrySettings,
				projectConfig: action.config,
			}
		}

		case 'ENTRY_CHANGED': {
			return {
				...entryState,
				...payload,
			}
		}

		case 'TOGGLE_TAB': {
			const asideTab: AsideTab = (entryState.asideTab === action.tab) ? null : action.tab
			return {
				...entryState,
				asideTab,
			}
		}

		case 'SET_ENTITY': {
			if (entryState.activeEntities.has(action.id)) {
				entryState.activeEntities.delete(action.id)
			} else {
				entryState.activeEntities.set(action.id, entryState.lookup.entities[action.id])
			}
			
			const activeEntities = new Map(entryState.activeEntities)

			return {
				...entryState,
				activeEntities,
		 		layers: updatePanels(entryState.layers, { activeEntities, entrySettings: entryState.entrySettings })
			}
		}

		case 'SET_FACSIMILE': {
			return {
				...entryState,
				layers: activateFacsimile(entryState.layers, action.id, action.triggerLayer)
			}
		}

		case 'TOGGLE_LAYER': {
			const nextLayers = entryState.layers.map(l => {
				if (l.id === action.id) {
					l.active = !l.active
					if (!l.active) l.pinned = false
				}
				return l
			})

			return {
				...entryState,
				layers: updatePanels(nextLayers, entryState)
			}
		}

		case 'PIN_PANEL': {
			const nextLayers = entryState.layers.map(l => {
				if (l.id === action.id) l.pinned = !l.pinned
				else l.pinned = false
				return l
			})

			return {
				...entryState,
				layers: updatePanels(nextLayers, entryState)
			}
		}

		case 'TOGGLE_SETTINGS_PROPERTY': {
			const entrySettings = {
				...entryState.entrySettings,
				[action.property]: !entryState.entrySettings[action.property]
			}
			
			return {
				...entryState,
				entrySettings,
				layers: updatePanels(
					entryState.layers, {
						activeEntities: entryState.activeEntities,
						entrySettings
					}
				)
			}
		}

		default:
			break
	}

	return entryState
}

export default function useEntryState() {
	const { config } = React.useContext(ProjectContext)
	const { entryId, query } = useUrlObject()
	const x = React.useReducer(entryStateReducer, initialEntryState)
	const entry = useEntry(entryId)
	const navigate = useNavigate()

	React.useEffect(() => {
		if (x[0].entry == null) return

		const activeFacsimileIds = x[0].layers
			.filter(l => l.activeFacsimile != null)
			.map(l => l.activeFacsimile.id)
			.filter((value, index, array) => array.indexOf(value) === index)

		navigate({
			entryId,
			query: {
				...query,
				facsimileId: activeFacsimileIds
			}
		})	
	}, [x[0].entry, x[0].layers, query])

	// React.useEffect(() => {
	// 	// If entry is not defined, there cannot be an active note,
	// 	// activeNote can be null to deselect the note
	// 	if (x[0].entry == null) return

	// 	console.log('trigger nav 2')
	// 	navigate({
	// 		entryId,
	// 		query: {
	// 			...query,
	// 			entityId: Array.from(x[0].activeEntities?.keys())
	// 		}
	// 	})	
	// }, [x[0].entry, x[0].activeEntities, query])

	React.useEffect(() => {
		if (entry == null || entry === x[0].entry) return

		// Copy current state of active and pinned layers to keep interface consistent between entry changes
		let nextLayers = entry.layers.map(layer => {
			const stateLayer = x[0].layers.find(l => l.id === layer.id)

			// Return layer as is if it did not exist on previous entry
			if (!stateLayer) return layer

			// Copy state
			layer.active = stateLayer.active 
			layer.pinned = stateLayer.pinned

			return layer
		})
		
		const lookup = createLookup(entry.layers)

		const activeEntities = new Map()
		query.entityId?.forEach(id =>
			activeEntities.set(id, lookup.entities[id])
		)

		query.facsimileId?.forEach(id => {
			nextLayers = activateFacsimile(nextLayers, id)
		})

		nextLayers.forEach(l => {
			if (!l.facsimiles.length) return
			if (l.activeFacsimile == null) l.activeFacsimile = l.facsimiles[0]
		})

		// TODO activeFacsimile is a state of layer, not the entry
		// x[1] = dispatch
		x[1]({
			activeEntities,
			entry,
			layers: updatePanels(nextLayers, x[0]),
			lookup,
			type: 'ENTRY_CHANGED',
		})
	}, [entry, query])

	React.useEffect(() => {
		// x[1] = dispatch
		x[1]({
			config,
			type: 'PROJECT_CHANGED',
		})
		
	}, [config.slug])

	return x
}

function updatePanels(
	layers: EntryState['layers'],
	{
		activeEntities,
		entrySettings
	}: Pick<EntryState, 'activeEntities' | 'entrySettings'>
) {
	const tpw = getTextPanelWidth(entrySettings, activeEntities)
	const activeLayers = layers.filter(l => l.active)
	const hasFacsimile = activeLayers.some(l => l.type === LayerType.Facsimile && !l.pinnable)

	return layers
		.map(layer => {
			if (!layer.active) return layer

			const width = isTextLayer(layer) ? tpw : DEFAULT_SPACING * 10

			const columnWidth = isTextLayer(layer) ?
				(hasFacsimile || layer.pinned) ? `${width}px` : `minmax(${width}px, 1fr)` :
				`minmax(${width}px, auto)`

			const pinnable = activeLayers.length > 2 || layer.pinned

			// If column width or pinnable change, create a new layer object
			if (layer.columnWidth !== columnWidth || layer.pinnable !== pinnable) {
				return {
					...layer,
					columnWidth,
					pinnable,
					width
				}
			}

			return layer
		})
}

function activateFacsimile(
	layers: EntryState['layers'],
	activeFacsimileId: string,
	triggerLayer?: Layer
): Layer[] {
	return layers.map(l => {
		const activeFacsimile = l.facsimiles.find(f => f.id === activeFacsimileId)
		if (activeFacsimile != null) {
			return {
				...l,
				activeFacsimile: {
					...activeFacsimile,
					triggerLayer: triggerLayer
				},
			}
		}

		return l
	})
}
