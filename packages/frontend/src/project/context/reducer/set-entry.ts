import { ProjectState, SetEntry, ID, StatefulLayer, SetEntryId } from '@docere/common'
import { updateLayers } from './layer'
import { createActiveFacsimile } from './set-facsimile'

/**
 * Setting an Entry is an async action, so first the setEntry data is set,
 * which triggers a useEffect in useProjectState to fetch and set the 'real' Entry.
 * Comparable to setting a Page.
 * 
 * @param state 
 * @param action 
 */
export function setEntryId(state: ProjectState, action: SetEntryId): ProjectState {
	return {
		...state,
		setEntry: action.setEntry
	}
}

export function setEntry(state: ProjectState, action: SetEntry): ProjectState {
	const layers: [ID, StatefulLayer][] = action.entry.layers.map(l => ([l.id, l]))

	const activeFacsimile = state.setEntry?.facsimileId != null ?
		createActiveFacsimile(action.entry, state.setEntry.facsimileId, state.setEntry.triggerContainer, state.setEntry.triggerContainerId) :
		action.entry.textData.facsimiles.values().next().value

	return {
		...state,
		activeFacsimile,
		entry: action.entry,
		layers: updateLayers(new Map(layers), state.entrySettings, state.activeEntities)
	}
}
