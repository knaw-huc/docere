import React from 'react'
import { useLocation, useParams } from "react-router-dom"
import { UrlObject } from './navigate'
import { ID } from '../entry/layer'

export interface UrlQuery {
	entityId?: Set<ID>
	// noteId?: string			/* ni */
	facsimileId?: Set<ID>	/* fi = pb */
	lineId?: Set<ID>			/* li = lb */
	blockId?: Set<ID>		/* bi = p, ab, div */
}

const urlQueryMap: Record<string, keyof UrlQuery> = {
	ei: 'entityId',
	// ni: 'noteId',
	fi: 'facsimileId',
	li: 'lineId',
	bi: 'blockId',
} as const

// function defaultPayload(): UrlObject {
// 	return {
// 		projectId: null,
// 		pageId: null,
// 		entryId: null,
// 		query: null,
// 	}
// }


// Turn the URL into an URL object
export function useUrlObject() {
	const location = useLocation()
	const { projectId, entryId, pageId } = useParams()
	const [urlObject, setUrlObject] = React.useState<UrlObject>({ projectId, entryId, pageId, query: {} })

	React.useEffect(() => {
		const nextQuery: UrlQuery = {}
	
		const searchParams = new URLSearchParams(location.search)
		Object.keys(urlQueryMap).forEach(key => {
			const value = searchParams.getAll(key)
			nextQuery[urlQueryMap[key]] = value.length ? new Set(value) : null
		})

		const nextPayload: UrlObject = {
			projectId,
			entryId,
			pageId,
			query: nextQuery
		}

		setUrlObject(nextPayload)
	}, [location.pathname, location.search])

	return urlObject 
}
