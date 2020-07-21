import React from 'react'
import { useLocation } from "react-router-dom"

export interface UrlQuery {
	entityId?: string		/* ei = person, location, gloss */
	noteId?: string			/* ni */
	facsimileId?: string	/* fi = pb */
	lineId?: string			/* li = lb */
	blockId?: string		/* bi = p, ab, div */
	partId?: string			/* pi */
}

const urlQueryMap: Record<string, keyof UrlQuery> = {
	ei: 'entityId',
	ni: 'noteId',
	fi: 'facsimileId',
	li: 'lineId',
	bi: 'blockId',
	pi: 'partId',
}

function defaultUrlQuery(): UrlQuery {
	return {}
}

export function useQuery() {
	const location = useLocation()
	const [query, setQuery] = React.useState<UrlQuery>(defaultUrlQuery())

	React.useEffect(() => {
		const nextQuery = defaultUrlQuery()
		for (const [key, value] of new URLSearchParams(location.search)) {
			if (!urlQueryMap.hasOwnProperty(key)) continue

			// See interface UrlQuery for key (ei, ni, fi, ...) descriptions
			nextQuery[urlQueryMap[key]] = value
		}
		setQuery(nextQuery)
	}, [location.search])

	return query 
}
