import { ProjectState, SetEntryId } from '@docere/common'

export function setEntryId(state: ProjectState, action: SetEntryId): ProjectState {
	return {
		...state,
		setEntry: action.setEntry
	}
}
