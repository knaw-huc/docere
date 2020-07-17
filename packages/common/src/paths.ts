import type { UrlQuery } from './types'

const PROJECTS = '/projects/'
const ENTRIES = '/entries/'
const PAGES = '/pages/'

/**
 * URL search query abbreviations
 * 
 * ei	entity ID 
 * et	entity type
 * ni	note ID
 * nt	note type
 */

function getQueryString(urlQuery: UrlQuery) {
	if (urlQuery == null) return ''

	return Object.keys(urlQuery)
		.filter((x: keyof UrlQuery) => urlQuery[x] != null)
		.reduce((prev, curr: keyof UrlQuery) => {
			prev = prev.length ? `${prev}&` : '?'
			const key = curr.charAt(0) + 'i'
			const value = encodeURIComponent(urlQuery[curr])
			return `${prev}${key}=${value}`
		}, '')
}

export function getSearchPath(projectId: string, query?: UrlQuery) {
	return `${PROJECTS}${projectId}${getQueryString(query)}`
}

export function getEntryPath(projectId: string, entryId: string, query?: UrlQuery) {
	return `${PROJECTS}${projectId}${ENTRIES}${entryId}${getQueryString(query)}`
}

export function getPagePath(projectId: string, pageId: string, query?: UrlQuery) {
	return `${PROJECTS}${projectId}${PAGES}${pageId}${getQueryString(query)}`
}

export function getPath(type: 'search' | 'entry' | 'page', projectId: string, id: string, query?: UrlQuery) {
	if (type === 'entry') return getEntryPath(projectId, id, query)
	if (type === 'page') return getPagePath(projectId, id, query)
	if (type === 'search') return getSearchPath(projectId, query)
}
