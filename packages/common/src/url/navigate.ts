// import React from 'react'
// import { useHistory } from "react-router-dom"
// import { UrlQuery, useUrlQuery } from './query'
// import { getPath, NextUrlObject } from './get-path'

// export type Navigate = (payload: UrlObject) => void

// export interface UrlObject {
// 	entryId?: string
// 	projectId?: string
// 	pageId?: string
// 	query?: UrlQuery
// }

// // Merge next query with the current query. The next query can be 
// // a partial query, so current props are either kept or overwritten
// function getNextQuery(currentQuery: UrlQuery, payloadQuery: UrlQuery) {
// 	const nextQuery = { ...currentQuery, ...payloadQuery }
// 	return nextQuery
// }

// // let prevUrlObject: UrlObject = { projectId: null, pageId: null, entryId: null }
// export function useNavigate() {
// 	const history = useHistory()
// 	const { projectId, entryId, pageId } = useParams()
// 	const urlQuery = useUrlQuery()

// 	const navigate = React.useCallback((nextUrlObject: UrlObject = {}) => {
// 		if (nextUrlObject.projectId == null) nextUrlObject.projectId = projectId
// 		// Get the next query if it's the first time navigate is used and when
// 		// the type (search, entry, page) stays the same. When the type changes,
// 		// the query should be removed
// 		// const nextQuery = (prevUrlObject.type == null || prevUrlObject.type === urlObject.type) ?
// 		// 	getNextQuery(prevUrlObject.query, urlObject.query) :
// 		// 	null
// 		const isSamePage = (
// 			urlQuery.projectId === nextUrlObject.projectId && 
// 			(
// 				(nextUrlObject.entryId != null && urlQuery.entryId === nextUrlObject.entryId) ||
// 				(nextUrlObject.pageId != null && urlQuery.pageId === nextUrlObject.pageId)
// 			)
// 		)

// 		if (isSamePage) nextUrlObject.query = getNextQuery(urlQuery.query, nextUrlObject.query)

// 		// When staying on the same type with the same ID, replace the entry in the history,
// 		// otherwise the back button would show all the UI interactions of the user
// 		// const method = prevUrlObject.type === urlObject.type && prevUrlObject.id === urlObject.id ? 'replace' : 'push'

// 		// Change the history
// 		const method = isSamePage ? 'replace' : 'push'
// 		history[method](getPath(nextUrlObject as NextUrlObject))

// 		// Store the previous payload, in order to check against it in the next call to navigate
// 		// prevUrlObject = urlObject
// 	}, [urlQuery])

// 	return navigate
// }
