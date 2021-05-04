import { ProjectState, ProjectAction, DTAP } from '@docere/common'

import { addEntity } from './add-entity'
import { setAsideTab } from './set-aside-tab'
import { setEntry, setEntryId } from './set-entry'
import { setFacsimile } from './set-facsimile'
import { setPage, setPageId, unsetPage } from './set-page'
import { setProject } from './set-project'
import { setViewport } from './set-viewport'
import { toggleEntrySetting } from './toggle-entry-setting'
import { toggleTab } from './toggle-tab'
import { pinLayer, toggleLayer } from './layer'

export function projectUIReducer(state: ProjectState, action: ProjectAction): ProjectState {
	if (DOCERE_DTAP === DTAP.Development) console.log('[ProjectReducer]', action)

	switch (action.type) {
		case 'ADD_ENTITY': return addEntity(state, action)
		case 'PIN_LAYER': return pinLayer(state, action)
		case 'SET_ASIDE_TAB': return setAsideTab(state, action)
		case 'SET_ENTRY': return setEntry(state, action)
		case 'SET_ENTRY_ID': return setEntryId(state, action)
		case 'SET_FACSIMILE': return setFacsimile(state, action)
		case 'SET_PAGE': return setPage(state, action)
		case 'SET_PAGE_ID': return setPageId(state, action)
		case 'SET_PROJECT': return setProject(state, action)
		case 'SET_VIEWPORT': return setViewport(state, action)
		case 'TOGGLE_ENTRY_SETTING': return toggleEntrySetting(state, action)
		case 'TOGGLE_LAYER': return toggleLayer(state, action)
		case 'TOGGLE_TAB': return toggleTab(state, action)
		case 'UNSET_PAGE': return unsetPage(state)

		default: break
	}

	return state
}
