import React from 'react'
import { useLocation } from "react-router-dom"
import { ID } from '../entry/layer'

export interface UrlQuery {
	entityId?: Set<ID>
	facsimileId?: Set<ID>	/* fi = pb */
	lineId?: Set<ID>		/* li = lb */
	blockId?: Set<ID>		/* bi = p, ab, div */
}

const urlQueryMap: Record<string, keyof UrlQuery> = {
	ei: 'entityId',
	fi: 'facsimileId',
	li: 'lineId',
	bi: 'blockId',
} as const

/**
 * Turn the query part of the URL into an URL query object
 */ 
export function useUrlQuery() {
	const location = useLocation()
	const [urlQuery, setUrlQuery] = React.useState<UrlQuery>(null)

	React.useEffect(() => {
		const nextQuery: UrlQuery = {}
	
		const searchParams = new URLSearchParams(location.search)
		Object.keys(urlQueryMap).forEach(key => {
			const value = searchParams.getAll(key)
			nextQuery[urlQueryMap[key]] = value.length ? new Set(value) : null
		})

		setUrlQuery(nextQuery)
	}, [location.search])

	return urlQuery 
}
