import { getEntriesFromSource, getSourceTree } from "@docere/common"
import React from "react"
import { SourceAction, sourceReducer, SourceState } from "./reducer"

export const projectId = 'republic'

export function useSourceState(): [SourceState, React.Dispatch<SourceAction>] {
	const [state, dispatch] = React.useReducer(
		sourceReducer,
		{ file: null, entries: [], entriesByPartId: {}, entry: null, jsonQuery: null, json: null, projectConfig: null, source: null, standoffTree: null }
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

function setEntries(state: SourceState, dispatch: React.Dispatch<SourceAction>, refresh = false) {
	state.file.text()
		.then((source: string) => {
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

			getSourceTree(JSON.parse(source), state.projectConfig)
				.then(standoffTree => {
					dispatch({
						standoffTree,
						type: "SET_STANDOFF_TREE",
					})
				})

			parsedSource = (
				state.projectConfig.documents.type === 'json' ||
				state.projectConfig.documents.type === 'standoff'
			) ?
				JSON.parse(source) :
				source

			const t0 = performance.now()
			getEntriesFromSource(state.file.name, parsedSource, state.projectConfig)
				.then(entries => {
					dispatch({
						entries,
						type: "SET_ENTRIES",
						refresh,
					})
					const t1 = performance.now(); console.log('Performance: ', `${t1 - t0}ms`)
				})
		})
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
