import React from "react"
import { SourceAction, sourceReducer, SourceState } from "./reducer"

export function postSource(file: File, dispatch: React.Dispatch<SourceAction>, refresh = false) {
	return file.text()
		.then((body: string) => {
			fetch(
				`/api/projects/republic/documents/${file.name}`,
				{
					body,
					headers: {
						'Content-Type': 'text/plain'
					},
					method: 'POST'
				}
			)
				.then(response => response.json())
				.then(entries => {
					dispatch({
						entries,
						type: "SET_ENTRIES",
						refresh,
					})
				})

		})
}

export function useSourceState(): [SourceState, React.Dispatch<SourceAction>] {
	const [state, dispatch] = React.useReducer(
		sourceReducer,
		{ file: null, entries: [], entry: null, jsonQuery: null, json: null }
	)

	React.useEffect(() => {
		if (state.file == null) return
		postSource(state.file, dispatch)
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

	return [state, dispatch]
}
