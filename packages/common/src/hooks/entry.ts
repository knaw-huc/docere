import React from 'react'

import { Entry, useUrlObject } from '..'
import { fetchJson } from '../utils'

const entryCache = new Map<string, Entry>()

export function useEntry(id: string) {
	const [entry, setEntry] = React.useState<Entry>(null)
	const { projectId, entryId } = useUrlObject()

	React.useEffect(() => {
		if (id == null) return

		if (entryCache.has(id)) {
			const entry = entryCache.get(id)
			setEntry(entry)
		} else {
			fetchJson(`/api/projects/${projectId}/documents/${entryId}`)
				.then(entry => {
					entryCache.set(entry.id, entry)
					setEntry(entry)
				})
		}
	}, [id])

	return entry
}
