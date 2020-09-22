import React from 'react'
import { useLocation, useParams } from "react-router-dom"
import { UrlObject } from './navigate'

export interface UrlQuery {
	entityId?: string		/* ei = person, location, gloss */
	noteId?: string			/* ni */
	facsimileId?: string	/* fi = pb */
	lineId?: string			/* li = lb */
	blockId?: string		/* bi = p, ab, div */
}

const urlQueryMap: Record<string, keyof UrlQuery> = {
	ei: 'entityId',
	ni: 'noteId',
	fi: 'facsimileId',
	li: 'lineId',
	bi: 'blockId',
}

// function defaultPayload(): UrlObject {
// 	return {
// 		projectId: null,
// 		pageId: null,
// 		entryId: null,
// 		query: null,
// 	}
// }

export function useUrlObject() {
	const location = useLocation()
	const { projectId, entryId, pageId } = useParams()
	const [urlObject, setUrlObject] = React.useState<UrlObject>({ projectId, entryId, pageId, query: {} })

	React.useEffect(() => {
		const nextQuery: UrlQuery = {}
		for (const [key, value] of new URLSearchParams(location.search)) {
			if (!urlQueryMap.hasOwnProperty(key)) continue

			// See interface UrlQuery for key (ei, ni, fi, ...) descriptions
			nextQuery[urlQueryMap[key]] = value
		}

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
