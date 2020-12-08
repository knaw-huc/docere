import React from 'react'
import { useParams } from 'react-router-dom'
import { Viewport, ProjectState, initialProjectState, ProjectAction, fetchEntry } from '@docere/common'
import configs from '@docere/projects'

import { projectUIReducer } from '../reducer'

/**
 * Wrapper function for the project state. The project state is made up
 * of a reducer and the resulting state is split into several context's.
 * Every context only triggers a re-render when "their" data is changed,
 * this makes for very precise control on which components are re-rendered
 * and which are not.
 * 
 * This is also the place where the URL is changed based on state changes
 * and where the state is loaded on page load.
 */
export function useProjectState(): [ProjectState, React.Dispatch<ProjectAction>] {
	const [state, dispatch] = React.useReducer(projectUIReducer, initialProjectState)
	const { projectId, entryId } = useParams()
	
	React.useEffect(() => {
		if (state.config == null || state.setEntry?.entryId == null) return

		fetchEntry(state.config.slug, state.setEntry.entryId)
			.then(entry => {
				if (entry == null) return
				dispatch({
					type: 'SET_ENTRY',
					entry
				})
			})
	}, [state.config?.slug, state.setEntry])

	React.useEffect(() => {
		if (
			state.config == null ||		/** Project hasn't loaded yet */
			state.entry?.id === entryId	/** Entry is already loaded */
		) return

		fetchEntry(state.config.slug, entryId)
			.then(entry => {
				if (entry == null) return
				dispatch({
					type: 'SET_ENTRY',
					entry
				})
			})
	}, [state.config, entryId])

	React.useEffect(() => {
		if (entryId != null && state.viewport !== Viewport.Entry) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.Entry })
		} else if (entryId == null && state.viewport !== Viewport.EntrySelector) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.EntrySelector })
		}
	}, [entryId])

	React.useEffect(() => {
		if (projectId == null) return
		
		if (configs[projectId].getUIComponents == null) configs[projectId].getUIComponents = async () => ({ default: new Map() })

		Promise.all([
			configs[projectId].config(),
			configs[projectId].getTextComponents(),
			configs[projectId].getUIComponents(),
		]).then(result => {
			const config = result[0].default
			dispatch({
				type: 'SET_PROJECT',
				config,
				getComponents: result[1].default(config),
				searchUrl: `/search/${config.slug}/_search`,
				uiComponents: result[2].default,
			})
		})
	}, [projectId])

	return [state, dispatch]
}
