import { ProjectState, SetProject } from '@docere/common';

export function setProject(state: ProjectState, action: SetProject): ProjectState {
	return {
		...state,
		config: action.config,
		getComponents: action.getComponents,
		i18n: action.i18n,
		searchUrl: action.searchUrl,
		uiComponents: action.uiComponents,
	}
}
