import { ProjectState, SetProject } from '@docere/common';

export function setProject(state: ProjectState, action: SetProject): ProjectState {
	return {
		...state,
		config: action.config,
		getComponents: action.getComponents,
		getUIComponent: action.getUIComponent,
		searchUrl: action.searchUrl,
	}
}
