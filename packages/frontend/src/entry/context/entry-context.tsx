import React from 'react'
import { Entry, EntryContext, fetchJson, SerializedEntry, deserializeEntry } from '@docere/common'
import { useParams } from 'react-router-dom'

const entryCache = new Map<string, Entry>()

export function EntryProvider(props: { children: React.ReactNode }) {
	const [entry, setEntry] = React.useState<Entry>(null)
	const { projectId, entryId } = useParams()

	React.useEffect(() => {
		if (projectId == null || entryId == null) return

		if (entryCache.has(entryId)) {
			setEntry(entryCache.get(entryId))
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

	if (entry == null) return null

	return (
		<EntryContext.Provider value={entry}>
			{props.children}
		</EntryContext.Provider>
	) 
}

// import React from 'react'

// import { Entry } from './index'
// import { fetchJson } from '../../utils'
// import { useUrlObject } from '../../url/query'
// import { SerializedEntry } from '..'
// import { deserializeEntry } from './deserialize'
// import { useParams } from 'react-router-dom'

// const entryCache = new Map<string, Entry>()

// export function useEntry(id: string) {
// 	const [entry, setEntry] = React.useState<Entry>(null)
// 	const { projectId, entryId } = useUrlObject()

// 	React.useEffect(() => {
// 		if (id == null) return

// 		if (entryCache.has(id)) {
// 			const entry = entryCache.get(id)
// 			setEntry(entry)
// 		} else {
// 			fetchJson(`/api/projects/${projectId}/documents/${encodeURIComponent(entryId)}`)
// 				.then((serializedEntry: SerializedEntry) => {
// 					if (serializedEntry == null) return
// 					const entry = deserializeEntry(serializedEntry)
// 					entryCache.set(serializedEntry.id, entry)
// 					setEntry(entry)
// 				})
// 		}
// 	}, [id])

// 	return entry
// }
