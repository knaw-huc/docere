import React from 'react'
import { useHistory, useParams, useLocation } from "react-router-dom"
import { getPath } from '@docere/common'

import type { NavigatePayload } from '@docere/common'

function getNextQuery(currentQuery: Record<string, string>, payloadQuery: Record<string, string>) {
	const nextQuery = { ...currentQuery }
	Object.keys(payloadQuery).forEach(key => {
		if (nextQuery.hasOwnProperty(key) && nextQuery[key] === payloadQuery[key]) delete nextQuery[key]
		else nextQuery[key] = payloadQuery[key]
	})	
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

// function areEqualObjects(obj1: Record<string, string>, obj2: Record<string, string>) {
// 	if (obj1 == null || obj2 == null) return false

// 	const keys1 = Object.keys(obj1)
// 	const keys2 = Object.keys(obj2)
// 	if (keys1.length !== keys2.length) return false
// 	if (!keys1.every(key1 => keys2.indexOf(key1) > -1)) return false

// 	const values1 = keys1.map(key1 => obj1[key1])
// 	const values2 = keys2.map(key2 => obj2[key2])
// 	if (!values1.every(value1 => values2.indexOf(value1) > -1)) return false

// 	return true
// }
// interface UrlQueryEntity {
// 	id: string
// 	type: string
// }

// interface UrlQuery {
// 	entity: UrlQueryEntity,
// 	note: UrlQueryEntity
// }

export function useQuery() {
	const location = useLocation()
	const [query, setQuery] = React.useState<Record<string, string>>(null)

	React.useEffect(() => {
		const x: Record<string, string> = {}
		for (const [key, value] of new URLSearchParams(location.search)) {
			x[key] = value
		}
		setQuery(x)
	}, [location.search])

	return query 
}
