import { DocereConfig, JsonEntry, PartialStandoff } from "@docere/common"

type EntriesByPartId = Record<string, JsonEntry[]>

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

interface SetSource {
	type: 'SET_SOURCE'
	source: string
}

interface SetProjectConfig {
	type: 'SET_PROJECT_CONFIG'
	projectConfig: DocereConfig
}

interface SetPartialStandoff {
	type: 'SET_STANDOFF_TREE'
	partialStandoff: PartialStandoff
}

export type SourceAction = 
	SetFile |
	SetEntries | 
	SetEntry |
	SetJsonQuery |
	SetJson	|
	SetProjectConfig |
	SetSource | 
	SetPartialStandoff

export interface SourceState {
	file: File
	entries: JsonEntry[]
	entriesByPartId: EntriesByPartId
	entry: JsonEntry
	jsonQuery: string
	json: string
	projectConfig: DocereConfig
	source: string
	partialStandoff: PartialStandoff
}
export function sourceReducer(state: SourceState, action: SourceAction): SourceState {
	switch (action.type) {
		case 'SET_FILE': return setFile(state, action)
		case 'SET_ENTRIES': return setEntries(state, action)
		case 'SET_ENTRY': return setEntry(state, action)
		case 'SET_JSON_QUERY': return setJsonQuery(state, action)
		case 'SET_JSON': return setJson(state, action)
		case 'SET_PROJECT_CONFIG': return setProject(state, action)
		case 'SET_SOURCE': return setSource(state, action)
		case 'SET_STANDOFF_TREE': return setPartialStandoff(state, action)
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
		entries: action.entries,
		entriesByPartId: action.entries.reduce<EntriesByPartId>((prev, curr) => {
			if (!prev.hasOwnProperty(curr.partId)) prev[curr.partId] = []
			prev[curr.partId].push(curr)
			return prev
		}, {} as EntriesByPartId)
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

function setSource(state: SourceState, action: SetSource): SourceState {
	return {
		...state,
		source: action.source
	}
}

function setPartialStandoff(state: SourceState, action: SetPartialStandoff): SourceState {
	return {
		...state,
		partialStandoff: action.partialStandoff
	}
}
