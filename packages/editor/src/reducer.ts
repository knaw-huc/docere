import { JsonEntry } from "@docere/common"

interface EntryDocument {
	id: string
	source_id: string
	name: string
	entry: JsonEntry
	updated: string
}

interface SetFile {
	type: 'SET_FILE',
	file: File
}

interface SetEntries {
	type: 'SET_ENTRIES',
	entries: EntryDocument[]
	refresh?: boolean
}

interface SetEntry {
	type: 'SET_ENTRY',
	entry: EntryDocument
}

interface SetJsonQuery {
	type: 'SET_JSON_QUERY',
	jsonQuery: string
}

interface SetJson {
	type: 'SET_JSON',
	json: object
}

export type SourceAction = 
	SetFile |
	SetEntries | 
	SetEntry |
	SetJsonQuery |
	SetJson	

export interface SourceState {
	file: File
	entries: EntryDocument[]
	entry: EntryDocument
	jsonQuery: string
	json: string
}
export function sourceReducer(state: SourceState, action: SourceAction): SourceState {
	switch (action.type) {
		case 'SET_FILE': return setFile(state, action)
		case 'SET_ENTRIES': return setEntries(state, action)
		case 'SET_ENTRY': return setEntry(state, action)
		case 'SET_JSON_QUERY': return setJsonQuery(state, action)
		case 'SET_JSON': return setJson(state, action)
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
		nextState.entry = action.entries.find(e => e.entry.id === nextState.entry.entry.id)
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
