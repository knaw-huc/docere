import { Entry } from './index'
import { fetchJson } from '../utils'
import { DocereConfig, JsonEntry } from '..'
import { createEntry } from './create'
import { getEntryApiPath } from '../url'

const entryCache = new Map<string, Entry>()

export async function fetchEntry(entryId: string, config: DocereConfig) {
	if (entryCache.has(entryId)) return entryCache.get(entryId)

	// const url = `/api/projects/${config.slug}/documents/${encodeURIComponent(entryId)}`
	const url = getEntryApiPath(config.slug, entryId)
	const serializedEntry: JsonEntry = await fetchJson(url)
	if (serializedEntry == null) return

	const entry = createEntry(serializedEntry, config)
	entryCache.set(entry.id, entry)

	return entry
}
