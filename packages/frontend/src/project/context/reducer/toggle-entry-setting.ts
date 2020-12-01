import { ProjectState, ToggleEntrySetting } from '@docere/common'

export function toggleEntrySetting(state: ProjectState, action: ToggleEntrySetting): ProjectState {
	return {
		...state,
		entrySettings: {
			...state.entrySettings,
			[action.property]: !state.entrySettings[action.property]
		}
	}
}
