import { DocereConfig, JsonEntry } from "@docere/common"

// interface EntryDocument {
// 	id: string
// 	source_id: string
// 	name: string
// 	entry: JsonEntry
// 	updated: string
// }

interface SetFile {
	type: 'SET_FILE'
	file: File
}

interface SetEntries {
	type: 'SET_ENTRIES'
	entries: JsonEntry[]
	refresh?: boolean
}

interface SetEntry {
	type: 'SET_ENTRY'
	entry: JsonEntry
}

interface SetJsonQuery {
	type: 'SET_JSON_QUERY'
	jsonQuery: string
}

interface SetJson {
	type: 'SET_JSON'
	json: object
}

// TODO remove any
interface SetProjectConfig {
	type: 'SET_PROJECT_CONFIG'
	projectConfig: DocereConfig
}

export type SourceAction = 
	SetFile |
	SetEntries | 
	SetEntry |
	SetJsonQuery |
	SetJson	|
	SetProjectConfig

export interface SourceState {
	file: File
	entries: JsonEntry[]
	entry: JsonEntry
	jsonQuery: string
	json: string
	projectConfig: DocereConfig
}
export function sourceReducer(state: SourceState, action: SourceAction): SourceState {
	switch (action.type) {
		case 'SET_FILE': return setFile(state, action)
		case 'SET_ENTRIES': return setEntries(state, action)
		case 'SET_ENTRY': return setEntry(state, action)
		case 'SET_JSON_QUERY': return setJsonQuery(state, action)
		case 'SET_JSON': return setJson(state, action)
		case 'SET_PROJECT_CONFIG': return setProject(state, action)
		default: break
	}

	return state
}

function setFile(state: SourceState, action: SetFile) {
	return {
		...state,
		file: action.file
	}
}

function setEntries(state: SourceState, action: SetEntries): SourceState {
	const nextState = {
		...state,
		entries: action.entries
	}

	if (!action.refresh) {
		nextState.entry = null
		nextState.json = null
	} else if (nextState.entry != null) {
		nextState.entry = action.entries.find(e => e.id === nextState.entry.id)
	}

	return nextState
}

function setEntry(state: SourceState, action: SetEntry) {
	return {
		...state,
		entry: action.entry
	}
}

function setJsonQuery(state: SourceState, action: SetJsonQuery) {
	return {
		...state,
		jsonQuery: action.jsonQuery
	}
}

function setJson(state: SourceState, action: SetJson) {
	return {
		...state,
		json: JSON.stringify(action.json)
	}
}

function setProject(state: SourceState, action: SetProjectConfig) {
	return {
		...state,
		projectConfig: action.projectConfig
	}
}
