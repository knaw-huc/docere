import { getEntriesFromSource, prepareSource } from "@docere/common"
import React from "react"
import { SourceAction, sourceReducer, SourceState } from "./reducer"

export const projectId = 'republic'

export function useSourceState(): [SourceState, React.Dispatch<SourceAction>] {
	const [state, dispatch] = React.useReducer(
		sourceReducer,
		{ file: null, entries: [], entriesByPartId: {}, entry: null, jsonQuery: null, json: null, projectConfig: null, source: null, partialStandoff: null }
	)

	React.useEffect(() => {
		if (state.file == null || state.projectConfig == null) return
		setEntries(state, dispatch)
	}, [state.file])

	React.useEffect(() => {
		if (state.jsonQuery == null || state.jsonQuery === '') {
			if (state.entry != null && state.json != JSON.stringify(state.entry)) {
				dispatch({ type: 'SET_JSON', json: state.entry })
			}
			return
		}

		let json: any = state.entry
		if (json == null) return
		state.jsonQuery.split('.').forEach(key => {
			if (json.hasOwnProperty(key)) {
				json = json[key]
			}
		})

		dispatch({ type: 'SET_JSON', json })
	}, [state.jsonQuery, state.entry])

	React.useEffect(() => {
		if (projectId == null) return
		setProjectConfig(dispatch)
	}, [projectId])

	React.useEffect(() => {
		if (state.entries.length) {
			setEntries(state, dispatch, true)
		}
	}, [state.projectConfig])

	return [state, dispatch]
}

async function setEntries(state: SourceState, dispatch: React.Dispatch<SourceAction>, refresh = false) {
	const source = await state.file.text()

	dispatch({
		type: "SET_SOURCE",
		source,
	})

	let parsedSource: string | object = (
		state.projectConfig.documents.type === 'json' ||
		state.projectConfig.documents.type === 'standoff'
	) ?
		JSON.parse(source) :
		source

	const partialStandoff = await prepareSource(parsedSource, state.projectConfig)
	dispatch({
		partialStandoff,
		type: "SET_STANDOFF_TREE",
	})

	const t0 = performance.now()
	const entries = await getEntriesFromSource(state.file.name, partialStandoff, state.projectConfig)
	dispatch({
		entries,
		type: "SET_ENTRIES",
		refresh,
	})
	const t1 = performance.now(); console.log('Performance: ', `${t1 - t0}ms`)

	// parsedSource = (
	// 	state.projectConfig.documents.type === 'json' ||
	// 	state.projectConfig.documents.type === 'standoff'
	// ) ?
	// 	JSON.parse(source) :
	// 	source
}

export function setProjectConfig(dispatch: React.Dispatch<SourceAction>) {
	loadProject(projectId)
		.then(projectConfig => {
			dispatch({
				type: 'SET_PROJECT_CONFIG',
				projectConfig,
			})
		})
}

export async function loadProject(projectId: string) {
	await loadScript('/projects.js')
	const { default: projectConfig } = await DocereProjects.default[projectId].config()
	return projectConfig
}

export function loadScript(src: string) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.append(script)
	})
}
