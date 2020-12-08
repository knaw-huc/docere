import { ProjectState, AddEntity, ActiveFacsimile } from '@docere/common'
import { createActiveFacsimile } from './set-facsimile'

export function addEntity(state: ProjectState, action: AddEntity): ProjectState {
	const { activeEntities } = state

	let activeFacsimile: ActiveFacsimile

	if (activeEntities.has(action.entityId)) {
		activeEntities.delete(action.entityId)
	} else {
		const activeEntity = state.entry.textData.entities.get(action.entityId)
		activeEntities.set(action.entityId, {
			...activeEntity,
			triggerContainer: action.triggerContainer,
			triggerContainerId: action.triggerContainerId,
		})

		if (
			!activeEntity.facsimileAreas.some(fa => fa.facsimileId === state.activeFacsimile.id) &&
			activeEntity.facsimileAreas.find(fa => fa.facsimileId != null) != null
		) {
			const facsimileArea = activeEntity.facsimileAreas.find(fa => fa.facsimileId != null)
			activeFacsimile = createActiveFacsimile(state.entry, facsimileArea.facsimileId, action.triggerContainer, action.triggerContainerId)
		}
	}

	

	const nextState = {
		...state,
		activeEntities: new Map(activeEntities),
	}

	if (activeFacsimile != null) nextState.activeFacsimile = activeFacsimile

	return nextState
}
