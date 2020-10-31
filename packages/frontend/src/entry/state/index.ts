import * as React from 'react'
import { ProjectContext, isTextLayer, AsideTab, getTextPanelWidth, LayerType, DEFAULT_SPACING, defaultEntrySettings, useUrlObject, useEntry, useNavigate } from '@docere/common'

import type { EntryState, EntryStateAction } from '@docere/common'

const initialEntryState: EntryState = {
	activeEntities: new Map(),
	activeFacsimiles: new Map(),
	layers: new Map(),
	asideTab: null,
	entrySettings: defaultEntrySettings,
	projectConfig: null,
	entry: null,
}

// @ts-ignore
window.DEBUG =true

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
				entryState.activeEntities.set(action.id, {
					...entryState.entry.textData.entities.get(action.id),
					layerId: action.layerId,
					triggerLayerId: action.triggerLayerId,
				})
			}

			return {
				...entryState,
				activeEntities: new Map(entryState.activeEntities)
			}
		}

		case 'SET_FACSIMILE': {
			return {
				...entryState,
				activeFacsimiles: new Map().set(action.id, {
					...entryState.entry.textData.facsimiles.get(action.id),
					layerId: action.layerId,
					triggerLayerId: action.triggerLayerId,

				})
			}
		}

		case 'TOGGLE_LAYER': {
			const layer = entryState.layers.get(action.id)
			const nextLayers = entryState.layers.set(action.id, {
				...layer,
				active: !layer.active,
				pinned: !layer.active ? false : layer.pinned,
			})

			return {
				...entryState,
				layers: updateLayers(nextLayers, entryState.entrySettings, entryState.activeEntities)
			}
		}

		case 'PIN_PANEL': {
			const layer = entryState.layers.get(action.id)
			const nextLayers = entryState.layers.set(action.id, {
				...layer,
				pinned: !layer.pinned
			})

			return {
				...entryState,
				layers: updateLayers(nextLayers, entryState.entrySettings, entryState.activeEntities)
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
				layers: updateLayers(
					entryState.layers,
					entrySettings,
					entryState.activeEntities
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

		navigate({
			entryId,
			query: {
				...query,
				facsimileId: new Set(x[0].activeFacsimiles.keys()),
				entityId: new Set(x[0].activeEntities.keys()),
			}
		})	
	}, [x[0].activeFacsimiles, x[0].activeEntities, query])

	React.useEffect(() => {
		if (entry == null || entry === x[0].entry) return

		// Copy current state of active and pinned layers to keep interface consistent between entry changes
		const nextLayers = new Map()
		entry.layers.forEach(layer => {
			// const stateLayer = x[0].layers.find(l => l.id === layer.id)
			const prevLayer = x[0].layers.get(layer.id)

			// Copy state if prev layer existed
			if (prevLayer) {
				layer.active = prevLayer.active 
				layer.pinned = prevLayer.pinned
			}

			nextLayers.set(layer.id, layer)
		})
		
		const activeEntities = new Map()
		query.entityId?.forEach(id =>
			activeEntities.set(id, entry.textData.entities.get(id))
		)

		const activeFacsimiles = new Map()
		query.facsimileId?.forEach(id => {
			activeFacsimiles.set(id, entry.textData.facsimiles.get(id))
		})

		// If the layer doesn't have an active facsimile, add the first
		// nextLayers.forEach(l => {
		// 	if (l.facsimiles.size && l.activeFacsimileId == null) {
		// 		l.activeFacsimileId = l.facsimiles.values().next().value
		// 	}
		// })

		// TODO activeFacsimile is a state of layer, not the entry
		// x[1] = dispatch
		x[1]({
			activeEntities,
			activeFacsimiles,
			entry,
			layers: updateLayers(nextLayers, x[0].entrySettings, activeEntities),
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

function updateLayers(
	nextLayers: EntryState['layers'],
	nextSettings: EntryState['entrySettings'],
	nextEntities: EntryState['activeEntities']
) {
	const allLayers = Array.from(nextLayers.values())
	const activeLayers = allLayers.filter(l => l.active)
	const hasFacsimile = activeLayers.some(l => l.active && l.type === LayerType.Facsimile && !l.pinnable)

	let hasChange = false

	nextLayers
		.forEach(layer => {
			if (!layer.active) return layer

			const width = isTextLayer(layer) ?
				getTextPanelWidth(nextSettings, nextEntities) :
				DEFAULT_SPACING * 10

			const columnWidth = isTextLayer(layer) ?
				(hasFacsimile || layer.pinned) ? `${width}px` : `minmax(${width}px, 1fr)` :
				`minmax(${width}px, auto)`

			const pinnable = activeLayers.length > 2 || layer.pinned

			// If column width or pinnable change, create a new layer object
			if (layer.columnWidth !== columnWidth || layer.pinnable !== pinnable) {
				hasChange = true
				nextLayers.set(layer.id, {
					...layer,
					columnWidth,
					pinnable,
					width,
				})
			}
		})

	return hasChange ? new Map(nextLayers) : nextLayers
}
