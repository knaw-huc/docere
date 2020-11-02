import React from 'react'

import { Entry } from './index'
import { fetchJson } from '../../utils'
import { useUrlObject } from '../../url/query'

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
			fetchJson(`/api/projects/${projectId}/documents/${encodeURIComponent(entryId)}`)
				.then((entry: Entry) => {
					if (entry == null) return
					entryCache.set(entry.id, entry)
					entry.textData.entities = new Map(entry.textData.entities)
					entry.textData.facsimiles = new Map(entry.textData.facsimiles)
					entry.layers.forEach(l => {
						l.entities = new Set(l.entities)
						l.facsimiles = new Set(l.facsimiles)
					})
					setEntry(entry)
				})
		}
	}, [id])

	return entry
}
