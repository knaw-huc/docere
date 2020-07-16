import React from 'react'
import { useLocation } from "react-router-dom"
import { UrlQuery } from '..'

function defaultUrlQuery(): UrlQuery {
	return {
		entity: null,
		note: null
	}
}

export default function useQuery() {
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
