import { ProjectState, SetAsideTab } from '@docere/common'

export function setAsideTab(state: ProjectState, action: SetAsideTab): ProjectState {
	return {
		...state,
		asideTab: action.tab,
	}
}
