import { ProjectState, SetEntry, ID, StatefulLayer } from '@docere/common'
import { updateLayers } from './layer'
import { createActiveFacsimile } from './set-facsimile'

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
