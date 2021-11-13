import { languageMaps, ProjectState, SetProject } from '@docere/common';

export function setProject(state: ProjectState, action: SetProject): ProjectState {
	return {
		...state,
		config: action.config,
		entrySettings: {
			...state.entrySettings,
			...action.config.entrySettings
		},
		getComponents: action.getComponents,
		i18n: languageMaps[action.config.language],
		searchUrl: action.config.search.url,
		uiComponents: action.uiComponents,
	}
}
