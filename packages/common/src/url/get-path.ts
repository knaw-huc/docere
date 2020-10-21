import type { UrlQuery } from "./query"
import type { UrlObject } from './navigate'

export function getQueryString(urlQuery: UrlQuery) {
	if (urlQuery == null) return ''

	return Object.keys(urlQuery)
		.filter((x: keyof UrlQuery) => urlQuery[x] != null)
		.reduce((prev, curr: keyof UrlQuery) => {
			const key = curr.charAt(0) + 'i'
			urlQuery[curr].forEach(value => {
				prev = prev.length ? `${prev}&` : '?'
				value = encodeURIComponent(value)
				prev = `${prev}${key}=${value}`
			}, '')
			return prev
		}, '')
}

const PROJECTS = '/projects/'
const ENTRIES = '/entries/'
const PAGES = '/pages/'

export function getSearchPath({ projectId, query }: UrlObject) { 
	return `${PROJECTS}${projectId}${getQueryString(query)}`
}

export function getEntryPath({ projectId, entryId, query }: UrlObject) {
	return `${PROJECTS}${projectId}${ENTRIES}${entryId}${getQueryString(query)}`
}

export function getPagePath({ projectId, pageId, query }: UrlObject) {
	return `${PROJECTS}${projectId}${PAGES}${pageId}${getQueryString(query)}`
}


export type NextUrlObject = Omit<UrlObject, 'projectId'> & { projectId: string }
export function getPath(urlObject: NextUrlObject) {
	if (urlObject?.projectId == null) throw new Error('[getPath] Project ID cannot be null')

	if		(urlObject.entryId != null) return getEntryPath(urlObject)
	else if (urlObject.pageId != null)	return getPagePath(urlObject)
	else								return getSearchPath(urlObject)
}

export function getEntryApiPath(projectId: string, entryId: string, prop: string = '') {
	return `/api/projects/${projectId}/documents/${encodeURIComponent(entryId)}/${prop}`
}

export function getProjectMappingPath(projectId: string) {
	return `/api/projects/${projectId}/mapping`
}
