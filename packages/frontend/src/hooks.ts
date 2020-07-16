import React from 'react'
import { useHistory, useParams, useLocation } from "react-router-dom"
import { getPath } from '@docere/common'

import type { NavigatePayload, UrlQuery } from '@docere/common'

function getNextQuery(currentQuery: UrlQuery, payloadQuery: UrlQuery) {
	const nextQuery = { ...currentQuery, ...payloadQuery }

	if (payloadQuery.entity?.id === currentQuery.entity?.id) nextQuery.entity = null
	if (payloadQuery.note?.id === currentQuery.note?.id) nextQuery.note = null

	console.log(nextQuery)

	return nextQuery
}

export function useNavigate() {
	const history = useHistory()
	const { projectId } = useParams()
	const query = useQuery()

	const navigate = React.useCallback((payload: NavigatePayload) => {
		history.push(getPath(payload.type, projectId, payload.id, getNextQuery(query, payload.query)))
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
