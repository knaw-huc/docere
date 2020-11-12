import React from 'react'

import { Entry } from './index'
import { fetchJson } from '../../utils'
import { useUrlObject } from '../../url/query'
import { SerializedEntry } from '..'
import { deserializeEntry } from './deserialize'

const entryCache = new Map<string, Entry>()

// TODO this is used in text-components/../../note-link.tsx, but refactor?
export function useEntry(id: string) {
	const [entry, setEntry] = React.useState<Entry>(null)
	const { projectId, entryId } = useUrlObject()

	React.useEffect(() => {
		if (id == null) return

		if (entryCache.has(id)) {
			const entry = entryCache.get(id)
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
	}, [id])

	return entry
}
