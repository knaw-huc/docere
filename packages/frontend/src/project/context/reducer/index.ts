import { ProjectState, ProjectAction } from '@docere/common'

import { addEntity } from './add-entity'
import { setAsideTab } from './set-aside-tab'
import { setEntry } from './set-entry'
import { setEntryId } from './set-entry-id'
import { setFacsimile } from './set-facsimile'
import { setProject } from './set-project'
import { setViewport } from './set-viewport'
import { toggleEntrySetting } from './toggle-entry-setting'
import { toggleTab } from './toggle-tab'
import { pinLayer, toggleLayer } from './layer'

export function projectUIReducer(state: ProjectState, action: ProjectAction): ProjectState {
	if ((window as any).DEBUG) console.log('[ProjectReducer]', action)

	switch (action.type) {
		case 'ADD_ENTITY': return addEntity(state, action)
		case 'SET_ASIDE_TAB': return setAsideTab(state, action)
		case 'SET_ENTRY': return setEntry(state, action)
		case 'SET_ENTRY_ID': return setEntryId(state, action)
		case 'SET_FACSIMILE': return setFacsimile(state, action)
		case 'SET_PROJECT': return setProject(state, action)
		case 'SET_VIEWPORT': return setViewport(state, action)
		case 'TOGGLE_ENTRY_SETTING': return toggleEntrySetting(state, action)
		case 'TOGGLE_LAYER': return toggleLayer(state, action)
		case 'PIN_LAYER': return pinLayer(state, action)
		case 'TOGGLE_TAB': return toggleTab(state, action)

		default: break
	}

	return state
}
