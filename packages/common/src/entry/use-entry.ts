import React from 'react'

import { Entry } from './index'
import { fetchJson } from '../utils'
import { SerializedEntry } from '..'
import { deserializeEntry } from './deserialize'

const entryCache = new Map<string, Entry>()

// TODO this is used in text-components/../../note-link.tsx, but refactor?
export function useEntry(projectId: string, entryId: string) {
	const [entry, setEntry] = React.useState<Entry>(null)
	// const { projectId, entryId } = useParams()

	React.useEffect(() => {
		if (projectId == null || entryId == null) return

		if (entryCache.has(entryId)) {
			const entry = entryCache.get(entryId)
			setEntry(entry)
		} else {
			fetchJson(`/api/projects/${projectId}/documents/${encodeURIComponent(entryId)}`)
				.then((serializedEntry: SerializedEntry) => {
					if (serializedEntry == null) return
					const entry = deserializeEntry(serializedEntry)
					entryCache.set(serializedEntry.id, entry)
					setEntry(entry)
				})
		}
	}, [projectId, entryId])

	return entry
}
