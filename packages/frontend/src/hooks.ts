import React from 'react'
import { useHistory, useParams, useLocation } from "react-router-dom"
import { getPath } from '@docere/common'

import type { NavigatePayload, UrlQuery } from '@docere/common'

function getNextQuery(currentQuery: UrlQuery, payloadQuery: UrlQuery) {
	const nextQuery = { ...currentQuery, ...payloadQuery }

	if (payloadQuery.entity?.id === currentQuery.entity?.id) nextQuery.entity = null
	if (payloadQuery.note?.id === currentQuery.note?.id) nextQuery.note = null

	return nextQuery
}

let prevPayload: NavigatePayload = { type: null, id: null }
export function useNavigate() {
	const history = useHistory()
	const { projectId } = useParams()
	const query = useQuery()

	const navigate = React.useCallback((payload: NavigatePayload) => {
		// Get the next query if it's the first time navigate is used and when
		// the type (search, entry, page) stays the same. When the type changes,
		// the query should be removed
		const nextQuery = (prevPayload.type == null || prevPayload.type === payload.type) ?
			getNextQuery(query, payload.query) :
			null

		// When staying on the same type with the same ID, replace the entry in the history,
		// otherwise the back button would show all the UI interactions of the user
		const method = prevPayload.type === payload.type && prevPayload.id === payload.id ? 'replace' : 'push'

		// Change the history
		history[method](getPath(payload.type, projectId, payload.id, nextQuery))

		// Store the previous payload, in order to check against it in the next call to navigate
		prevPayload = payload
	}, [projectId, query])

	return navigate
}

function defaultUrlQuery(): UrlQuery {
	return {
		entity: null,
		note: null
	}
}

export function useQuery() {
	const location = useLocation()
	const [query, setQuery] = React.useState<UrlQuery>(defaultUrlQuery())

	React.useEffect(() => {
		const nextQuery = defaultUrlQuery()
		for (const [key, value] of new URLSearchParams(location.search)) {
			if (key.charAt(0) === 'e' && nextQuery.entity == null) nextQuery.entity = { id: null, type: null }
			if (key.charAt(0) === 'n' && nextQuery.note == null) nextQuery.note = { id: null, type: null }
			if (key === 'ei') nextQuery.entity.id = value
			if (key === 'et') nextQuery.entity.type = value
			if (key === 'ni') nextQuery.note.id = value
			if (key === 'nt') nextQuery.note.type = value
		}
		setQuery(nextQuery)
	}, [location.search])

	return query 
}
