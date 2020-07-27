import React from "react"
import { useUrlObject, fetchJson } from '@docere/common'

interface AnalyzeState {
	documents: string[]
	tags: string[]
	attributeNames: string[]
	attributeValues: string[]
}
const initialState: AnalyzeState = {
	documents: [],
	tags: [],
	attributeNames: [],
	attributeValues: [],
}

interface SetDocuments {
	type: 'SET_DOCUMENTS'
	documents: string[]
}
interface SetTags {
	type: 'SET_TAGS'
	tags: string[]
}
interface SetAttributeNames {
	type: 'SET_ATTRIBUTE_NAMES'
	attributeNames: string[]
}
interface SetAttributeValues {
	type: 'SET_ATTRIBUTE_VALUES'
	attributeValues: string[]
}
type AnalyzeStateAction = SetDocuments | SetTags | SetAttributeNames | SetAttributeValues

function analyzeStateReducer(analyzeState: AnalyzeState, action: AnalyzeStateAction): AnalyzeState {
	if ((window as any).DEBUG) console.log('[AnalyzeState]', action)

	switch (action.type) {
		case 'SET_DOCUMENTS': {
			return {
				...analyzeState,
				documents: action.documents,
			}
		}

		case 'SET_TAGS': {
			return {
				...analyzeState,
				tags: action.tags,
			}
		}

		case 'SET_ATTRIBUTE_NAMES': {
			return {
				...analyzeState,
				attributeNames: action.attributeNames,
			}
		}

		case 'SET_ATTRIBUTE_VALUES': {
			return {
				...analyzeState,
				attributeValues: action.attributeValues,
			}
		}

		default:
			break
	}

	return analyzeState
}

// let historyNavigator: HistoryNavigator
export default function useAnalyzeState(): [AnalyzeState, React.Dispatch<AnalyzeStateAction>] {
	const [state, dispatch] = React.useReducer(analyzeStateReducer, initialState)
	const { projectId } = useUrlObject()

	React.useEffect(() => {
		fetchJson(`/api/projects/${projectId}/analyze/documents`)
			.then(documents => dispatch({ type: 'SET_DOCUMENTS', documents }))

		fetchJson(`/api/projects/${projectId}/analyze/tags`)
			.then(tags => dispatch({ type: 'SET_TAGS', tags }))

		fetchJson(`/api/projects/${projectId}/analyze/attributeNames`)
			.then(attributeNames => dispatch({ type: 'SET_ATTRIBUTE_NAMES', attributeNames }))

		fetchJson(`/api/projects/${projectId}/analyze/attributeValues`)
			.then(attributeValues => dispatch({ type: 'SET_ATTRIBUTE_VALUES', attributeValues }))
	}, [])

	return [state, dispatch]
}
