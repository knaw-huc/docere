const PROJECTS = '/projects/'
const ENTRIES = '/entries/'
const PAGES = '/pages/'

function getQueryString(query: Record<string, string>) {
	if (query == null) return ''
	return Object.keys(query)
		.reduce((prev, curr) => {
			prev = prev.length ? `${prev}&` : '?'
			return `${prev}${curr}=${query[curr]}`
		}, '')
}

export function getSearchPath(projectId: string, query?: Record<string, string>) {
	return `${PROJECTS}${projectId}${getQueryString(query)}`
}

export function getEntryPath(projectId: string, entryId: string, query?: Record<string, string>) {
	return `${PROJECTS}${projectId}${ENTRIES}${entryId}${getQueryString(query)}`
}

export function getPagePath(projectId: string, pageId: string, query?: Record<string, string>) {
	return `${PROJECTS}${projectId}${PAGES}${pageId}${getQueryString(query)}`
}

export function getPath(type: 'search' | 'entry' | 'page', projectId: string, id: string, query?: Record<string, string>) {
	if (type === 'entry') return getEntryPath(projectId, id, query)
	if (type === 'page') return getPagePath(projectId, id, query)
	if (type === 'search') return getSearchPath(projectId, query)
}
