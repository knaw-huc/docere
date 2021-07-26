import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Viewport, ProjectState, initialProjectState, ProjectAction, fetchEntry, fetchPage, getPagePath, getEntryPath, DTAP } from '@docere/common'
import configs from '../../../../../projects/src'

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
	const { projectId, entryId, pageId } = useParams<{ projectId: string, entryId: string, pageId: string }>()
	const history = useHistory()

	React.useEffect(() => {
		if (state.config == null || state.setEntry?.entryId == null) return

		fetchEntry(state.setEntry.entryId, state.config)
			.then(entry => {
				if (entry == null) return
				dispatch({
					type: 'SET_ENTRY',
					entry
				})
				history.push(getEntryPath(state.config.slug, entry.id))
			})
	}, [state.config?.slug, state.setEntry])

	React.useEffect(() => {
		if (
			state.config == null ||		/** Project hasn't loaded yet */
			entryId == null || 			/** Navigating away from entry */
			state.entry?.id === entryId	/** Entry is already currently loaded entry */
		) return

		fetchEntry(entryId, state.config)
			.then(entry => {
				if (entry == null) return
				dispatch({
					type: 'SET_ENTRY',
					entry
				})
			})
	}, [state.config, entryId])

	React.useEffect(() => {
		if (state.config == null || state.setPage?.pageId == null) return

		fetchPage(state.setPage.pageId, state.config)
			.then(page => {
				if (page == null) return
				dispatch({
					type: 'SET_PAGE',
					page,
				})
				history.push(getPagePath(state.config.slug, page.id))
			})
	}, [state.config?.slug, state.setPage])

	React.useEffect(() => {
		if (state.config == null || pageId == null) return

		fetchPage(pageId, state.config)
			.then(page => {
				if (page == null) return
				dispatch({
					type: 'SET_PAGE',
					page,
				})
			})
	}, [state.config?.slug, pageId])

	React.useEffect(() => {
		// When pageId is set, do not change the viewport
		if (pageId != null) return

		if (entryId != null && state.viewport !== Viewport.Entry) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.Entry })
		} else if (entryId == null && state.viewport !== Viewport.EntrySelector) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.EntrySelector })
		}
	}, [entryId, pageId])

	React.useEffect(() => {
		if (DOCERE_DTAP === DTAP.Development) console.log('[ActiveFacsimile]', state.activeFacsimile)

		if (state.entry != null && state.viewport !== Viewport.Entry) {
			dispatch({ type: 'SET_VIEWPORT', viewport: Viewport.Entry })
			history.push(getEntryPath(state.config.slug, state.entry.id))
		}
	}, [state.activeFacsimile])

	if (DOCERE_DTAP === DTAP.Development) {
		React.useEffect(() => {
			console.log('[ActiveEntities]', Array.from(state.activeEntities.values()))
		}, [state.activeEntities])
	}

	React.useEffect(() => {
		if (projectId == null) return
		
		Promise.allSettled([
			configs[projectId].config(),
			configs[projectId].getTextComponents(),
			configs[projectId].getUIComponents(),
		]).then(result => {
			const [configResult, textCompResult, UICompResult] = result

			if (configResult.status === 'rejected') {
				throw new Error(`Project config not found for "${projectId}"`)
			}

			const config = configResult.value.default

			dispatch({
				type: 'SET_PROJECT',
				config,
				getComponents: textCompResult.status === 'fulfilled' ?
					textCompResult.value.default(config) :
					async () => ({}),
				searchUrl: `/search/${config.slug}/_search`,
				uiComponents: UICompResult.status === 'fulfilled' ?
					UICompResult.value.default :
					new Map()
			})
		})
	}, [projectId])


	if (DOCERE_DTAP === DTAP.Development) {
		React.useEffect(() => {
			// TODO add declare window.projectState
			// @ts-ignore
			window.projectState = state
		}, [state])
	}

	return [state, dispatch]
}
