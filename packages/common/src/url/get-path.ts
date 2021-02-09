import type { UrlQuery } from "./query"
// import type { UrlObject } from './navigate'

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

export function getProjectPath(projectId: string) { 
	return `${PROJECTS}${projectId}`
}

export function getSearchPath(projectId: string, query?: UrlQuery) { 
	return `${getProjectPath(projectId)}${getQueryString(query)}`
}

export function getEntryPath(projectId: string, entryId: string, query?: UrlQuery) {
	return `${getProjectPath(projectId)}${ENTRIES}${entryId}${getQueryString(query)}`
}

export function getPagePath(projectId: string, pageId: string, query?: UrlQuery) {
	return `${getProjectPath(projectId)}${PAGES}${pageId}${getQueryString(query)}`
}


// export type NextUrlObject = Omit<UrlObject, 'projectId'> & { projectId: string }
// export function getPath(urlObject: NextUrlObject) {
// 	if (urlObject?.projectId == null) throw new Error('[getPath] Project ID cannot be null')

// 	if		(urlObject.entryId != null) return getEntryPath(urlObject)
// 	else if (urlObject.pageId != null)	return getPagePath(urlObject)
// 	else								return getSearchPath(urlObject)
// }

export const API_BASE_PATH = '/api/projects'

export function getEntryApiPath(projectId: string, entryId: string, prop: string = '') {
	return `${API_BASE_PATH}/${projectId}/documents/${encodeURIComponent(entryId)}/${prop}`
}

export function getProjectMappingPath(projectId: string) {
	return `${API_BASE_PATH}/${projectId}/mapping`
}

export function getProjectPagePath(projectId: string, pageId: string) {
	return `${API_BASE_PATH}/${projectId}/pages/${pageId}`
}
