import React from 'react'
import { useHistory, useParams } from "react-router-dom"

import { UrlQuery, NavigatePayload, getPath } from '..'
import useQuery from './query'

function getNextQuery(currentQuery: UrlQuery, payloadQuery: UrlQuery) {
	const nextQuery = { ...currentQuery, ...payloadQuery }

	if (payloadQuery.entity?.id === currentQuery.entity?.id) nextQuery.entity = null
	if (payloadQuery.note?.id === currentQuery.note?.id) nextQuery.note = null

	return nextQuery
}

let prevPayload: NavigatePayload = { type: null, id: null }
export default function useNavigate() {
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
