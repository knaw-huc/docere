import { ProjectState, SetFacsimile, Entry, ActiveFacsimile, ID, ContainerType } from '@docere/common'

export function createActiveFacsimile(
	entry: Entry,
	facsimileId: ID,
	triggerContainer?: ContainerType,
	triggerContainerId?: ID,
): ActiveFacsimile {
	if (entry == null) return
	return {
		...entry.textData.facsimiles.get(facsimileId),
		triggerContainer,
		triggerContainerId,
	}
}

export function setFacsimile(state: ProjectState, action: SetFacsimile): ProjectState {
	if (action.entryId != null && state.entry?.id !== action.entryId) {
		return {
			...state,
			setEntry: {
				entryId: action.entryId,
				facsimileId: action.facsimileId,
				triggerContainer: action.triggerContainer,
				triggerContainerId: action.triggerContainerId
			}
		}
	}

	return {
		...state,
		activeFacsimile: createActiveFacsimile(
			state.entry,
			action.facsimileId,
			action.triggerContainer,
			action.triggerContainerId
		)
	}
}
