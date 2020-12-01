import { ProjectState, AddEntity } from '@docere/common'

export function addEntity(state: ProjectState, action: AddEntity): ProjectState {
	const { activeEntities } = state

	if (activeEntities.has(action.entityId)) {
		activeEntities.delete(action.entityId)
	} else {
		const activeEntity = state.entry.textData.entities.get(action.entityId)
		activeEntities.set(action.entityId, {
			...activeEntity,
			triggerContainer: action.triggerContainer,
			triggerContainerId: action.triggerContainerId,
		})
	}

	return {
		...state,
		activeEntities: new Map(activeEntities),
	}
}
