import { ProjectState, SetPage, SetPageId, ActiveEntities } from '@docere/common'

export function setPage(state: ProjectState, action: SetPage): ProjectState {
	return {
		...state,
		page: action.page,
	}
}

export function setPageId(state: ProjectState, action: SetPageId): ProjectState {
	const activeEntities: ActiveEntities = new Map()
	if (action.setPage.entityIds?.size > 0) {
		for (const id of action.setPage.entityIds.values()) {
			activeEntities.set(id, state.entry.textData.entities.get(id))
		}
	}

	return {
		...state,
		activeEntities,
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
