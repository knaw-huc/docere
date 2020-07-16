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

function getQueryString(query: UrlQuery) {
	if (query.entity == null && query.note == null) return ''

	return Object.keys(query)
		.reduce((prev, curr: 'entity' | 'note') => {
			if (query[curr] == null) return prev
			prev = prev.length ? `${prev}&` : '?'
			return `${prev}${curr.charAt(0)}i=${encodeURIComponent(query[curr].id)}&${curr.charAt(0)}t=${query[curr].type}`
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
