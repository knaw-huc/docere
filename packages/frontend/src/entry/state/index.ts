import * as React from 'react'
import { ProjectContext, isTextLayer, AsideTab, getTextPanelWidth, LayerType, DEFAULT_SPACING, defaultEntrySettings, useQuery } from '@docere/common'

import type { EntryState, EntryStateAction, FacsimileArea, Entry } from '@docere/common'

const initialEntryState: EntryState = {
	activeEntity: null,
	activeFacsimile: null,
	activeFacsimileAreas: null,
	activeNote: null,
	asideTab: null,
	entrySettings: defaultEntrySettings,
	projectConfig: null,
	entry: null,
	layers: [],
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

		case 'SET_ENTITY': {
			let activeFacsimileAreas = entryState.entry.facsimiles?.reduce((prev, curr) => {
				curr.versions.forEach(version => {
					version.areas.forEach(area => {
						if (area.target?.id === action.id) {
							if (!Array.isArray(prev)) prev = []
							prev.push(area)
						}
					})
				})
				return prev
			}, null as FacsimileArea[])

			let entity = entryState.entry.entities?.find(e => e.id === action.id)
			if (entity == null) entity = { id: action.id, type: null, value: null }

			const config = entryState.projectConfig.entities.find(x => x.id === entity.type)
			if (config == null) console.error(`[SET_ENTITY] config not found for '${entity.type}' with ID: ${entity.id}`)
			let activeEntity = { ...entity, config }
			
			return {
				...entryState,
				activeEntity,
				activeFacsimileAreas,
				layers: updatePanels(entryState.layers, { activeEntity, activeNote: entryState.activeNote, entrySettings: entryState.entrySettings })
			}
		}

		case 'UNSET_ENTITY': {
			return {
				...entryState,
				activeEntity: null,
				activeFacsimileAreas: null,
				layers: updatePanels(entryState.layers, { activeEntity: null, activeNote: entryState.activeNote, entrySettings: entryState.entrySettings })
			}
		}

		case 'SET_NOTE': {
			const activeNote = entryState.entry.notes.find(n => n.id === action.id)

			return {
				...entryState,
				activeNote,
				layers: updatePanels(entryState.layers, { activeEntity: entryState.activeEntity, activeNote, entrySettings: entryState.entrySettings })
			}
		}

		case 'UNSET_NOTE': {
			return {
				...entryState,
				activeNote: null,
				layers: updatePanels(entryState.layers, { activeEntity: entryState.activeEntity, activeNote: null, entrySettings: entryState.entrySettings })
			}

		}

		case 'TOGGLE_TAB': {
			const asideTab: AsideTab = (entryState.asideTab === action.tab) ? null : action.tab
			return {
				...entryState,
				asideTab,
			}
		}

		case 'SET_ACTIVE_FACSIMILE': {
			const activeFacsimile = entryState.entry.facsimiles.find(f => f.id === action.id)

			return {
				...entryState,
				activeFacsimile,
				activeFacsimileAreas: null
			}
		}

		case 'SET_ACTIVE_FACSIMILE_AREAS': {
			let activeFacsimileAreas = entryState.entry.facsimiles
				.reduce((prev, curr) => {
					curr.versions.forEach(version => {
						version.areas.forEach(area => {
							if (action.ids.indexOf(area.id) > -1) prev.push(area)
						})
					})
					return prev
				}, [] as FacsimileArea[])
			
			if (JSON.stringify(action.ids) === JSON.stringify(entryState.activeFacsimileAreas?.map(afa => afa.id))) {
				activeFacsimileAreas = null
			}

			return {
				...entryState,
				activeFacsimileAreas,
				activeEntity: null,
				activeNote: null,
				asideTab: null
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
						activeEntity: entryState.activeEntity,
						activeNote: entryState.activeNote,
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


export default function useEntryState(entry: Entry) {
	const { config } = React.useContext(ProjectContext)
	const query = useQuery()
	const x = React.useReducer(entryStateReducer, initialEntryState)

	React.useEffect(() => {
		if (x[0].entry == null) return

		if (query.entityId !== x[0].activeEntity?.id) {
			if (query.entityId == null) {
				x[1]({
					type: 'UNSET_ENTITY',
				})
			} else {
				x[1]({
					type: 'SET_ENTITY',
					id: query.entityId,
				})

			}
		}

		if (query.noteId !== x[0].activeNote?.id) {
			if (query.noteId == null) {
				x[1]({
					type: 'UNSET_NOTE',
				})
			} else {
				x[1]({
					type: 'SET_NOTE',
					id: query.noteId,
				})
			}
		}
	}, [query])

	React.useEffect(() => {
		if (entry == null) return

		// Copy current state of active and pinned layers to keep interface consistent between entry changes
		const nextLayers = entry.layers.map(layer => {
			// x[0] = entryState
			const stateLayer = x[0].layers.find(l => l.id === layer.id)
			if (!stateLayer) return layer
			layer.active = stateLayer.active 
			layer.pinned = stateLayer.pinned
			return layer
		})

		// x[1] = dispatch
		x[1]({
			activeFacsimile: entry.facsimiles?.length ? entry.facsimiles[0] : null,
			entry,
			layers: updatePanels(nextLayers, x[0]),
			type: 'ENTRY_CHANGED',
		})
	}, [entry])

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
		activeEntity,
		activeNote,
		entrySettings
	}: Pick<EntryState, 'activeEntity' | 'activeNote' | 'entrySettings'>
) {
	const tpw = getTextPanelWidth(entrySettings, activeNote, activeEntity)
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
