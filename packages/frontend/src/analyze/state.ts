import React from "react"
import { useUrlObject, fetchJson, fetchPost } from '@docere/common'

interface AnalyzeState {
	activeAttributeNames: string[]
	activeAttributeValues: string[]
	activeDocuments: string[]
	activeTags: string[]
	attributeNames: string[]
	attributeValues: string[]
	documents: string[]
	selectedAttributeNames: string[]
	selectedAttributeValues: string[]
	selectedDocuments: string[]
	selectedTags: string[]
	tags: string[]
}
const initialState: AnalyzeState = {
	activeDocuments: [],
	activeTags: [],
	activeAttributeNames: [],
	activeAttributeValues: [],
	attributeNames: [],
	attributeValues: [],
	documents: [],
	selectedAttributeValues: [],
	selectedAttributeNames: [],
	selectedDocuments: [],
	selectedTags: [],
	tags: [],
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
export interface AddSelected {
	type: 'ADD_SELECTED'
	type2: 'document_name' | 'tag_name' | 'attribute_name' | 'attribute_value'
	value: string
}
interface SetActive {
	type: 'SET_ACTIVE'
	active: {
		documents: string[]
		tags: string[]
		attribute_names: string[]
		attribute_values: string[]
	}
}
export type AnalyzeStateAction = SetDocuments | SetTags | SetAttributeNames | SetAttributeValues | AddSelected | SetActive

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

		case 'ADD_SELECTED': {
			let prop: keyof AnalyzeState
			if (action.type2 === 'document_name') prop = 'selectedDocuments'
			if (action.type2 === 'tag_name') prop = 'selectedTags'
			if (action.type2 === 'attribute_name') prop = 'selectedAttributeNames'
			if (action.type2 === 'attribute_value') prop = 'selectedAttributeValues'

			const propValue = analyzeState[prop].indexOf(action.value) > -1 ?
				analyzeState[prop].filter(p => p !== action.value) :
				analyzeState[prop].concat(action.value)

			return {
				...analyzeState,
				[prop]: propValue
			}
		}

		case 'SET_ACTIVE': {
			return {
				...analyzeState,
				activeDocuments: action.active.documents || [],
				activeTags: action.active.tags || [],
				activeAttributeNames: action.active.attribute_names || [],
				activeAttributeValues: action.active.attribute_values || [],
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

	React.useEffect(() => {
		if (state.selectedDocuments.length + state.selectedTags.length + state.selectedAttributeNames.length + state.selectedAttributeValues.length === 0) {
			dispatch({
				type: 'SET_ACTIVE',
				active: {
					documents: [],
					tags: [],
					attribute_names: [],
					attribute_values: [],
				}
			})
			return
		}
		fetchPost(`/api/projects/${projectId}/analyze/tmp`, {
			document_name: state.selectedDocuments,
			tag_name: state.selectedTags,
			attribute_name: state.selectedAttributeNames,
			attribute_value: state.selectedAttributeValues
		})
			.then(active => dispatch({ type: 'SET_ACTIVE', active}))

	}, [state.selectedDocuments, state.selectedTags, state.selectedAttributeNames, state.selectedAttributeValues])

	return [state, dispatch]
}
