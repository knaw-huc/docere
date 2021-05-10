// import React from 'react'

import { Entry } from './index'
import { fetchJson } from '../utils'
import { DocereConfig, SerializedEntry } from '..'
import { deserializeEntry } from './deserialize'
// import { ProjectContext } from '../project/context'

const entryCache = new Map<string, Entry>()

export async function fetchEntry(entryId: string, config: DocereConfig) {
	if (entryCache.has(entryId)) return entryCache.get(entryId)

	const url = `/api/projects/${config.slug}/documents/${encodeURIComponent(entryId)}`
	const serializedEntry: SerializedEntry = await fetchJson(url)
	if (serializedEntry == null) return

	const entry = deserializeEntry(serializedEntry, config)
	entryCache.set(entry.id, entry)

	return entry
}

// export function useEntry(entryId: string) {
// 	const { config } = React.useContext(ProjectContext)
// 	const [entry, setEntry] = React.useState<Entry>(null)

// 	React.useEffect(() => {
// 		if (config == null || entryId == null) return
// 		fetchEntry(entryId, config).then(setEntry)
// 	}, [config, entryId])

// 	return entry
// }
