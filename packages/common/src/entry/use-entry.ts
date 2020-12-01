import React from 'react'

import { Entry } from './index'
import { fetchJson } from '../utils'
import { SerializedEntry } from '..'
import { deserializeEntry } from './deserialize'

const entryCache = new Map<string, Entry>()

export async function fetchEntry(projectId: string, entryId: string) {
	if (entryCache.has(entryId)) return entryCache.get(entryId)

	const serializedEntry: SerializedEntry = await fetchJson(`/api/projects/${projectId}/documents/${encodeURIComponent(entryId)}`)
	if (serializedEntry == null) return

	const entry = deserializeEntry(serializedEntry)
	entryCache.set(entry.id, entry)

	return entry
}

export function useEntry(projectId: string, entryId: string) {
	const [entry, setEntry] = React.useState<Entry>(null)

	React.useEffect(() => {
		if (projectId == null || entryId == null) return
		fetchEntry(projectId, entryId).then(setEntry)
	}, [projectId, entryId])

	return entry
}
