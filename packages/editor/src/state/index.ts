import { getEntriesFromSource } from "@docere/common"
import React from "react"
import { SourceAction, sourceReducer, SourceState } from "./reducer"
import configs from '../../../projects/src'

const projectId = 'republic'

export function useSourceState(): [SourceState, React.Dispatch<SourceAction>] {
	const [state, dispatch] = React.useReducer(
		sourceReducer,
		{ file: null, entries: [], entry: null, jsonQuery: null, json: null, projectConfig: null }
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

export function setProjectConfig(dispatch: React.Dispatch<SourceAction>) {
	configs[projectId].config()
		.then(response => {
			const projectConfig = response.default
			console.log(projectConfig.slug, 'after then')

			console.log(projectConfig.slug)
			dispatch({
				type: 'SET_PROJECT_CONFIG',
				projectConfig,
			})
		})
}

function setEntries(state: SourceState, dispatch: React.Dispatch<SourceAction>, refresh = false) {
	state.file.text()
		.then((source: string) => {
			const parsedSource: string | object = (
				state.projectConfig.documents.type === 'json' ||
				state.projectConfig.documents.type === 'standoff'
			) ?
				JSON.parse(source) :
				source

			getEntriesFromSource(state.file.name, parsedSource, state.projectConfig)
				.then(entries => {
					dispatch({
						entries,
						type: "SET_ENTRIES",
						refresh,
					})
				})
		})
}
