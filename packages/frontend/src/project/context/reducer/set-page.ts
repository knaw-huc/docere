import { ProjectState, SetPage, SetPageId } from '@docere/common';

export function setPage(state: ProjectState, action: SetPage): ProjectState {
	return {
		...state,
		page: action.page,
	}
}

export function setPageId(state: ProjectState, action: SetPageId): ProjectState {
	return {
		...state,
		setPage: action.setPage,
	}
}

export function unsetPage(state: ProjectState): ProjectState {
	return {
		...state,
		setPage: null,
		page: null,
	}
}
