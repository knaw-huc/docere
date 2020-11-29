import React from 'react'
import { Entry, EntryContext, fetchJson, SerializedEntry, deserializeEntry, SetEntryProps, getEntryPath } from '@docere/common'
import { useParams, useHistory } from 'react-router-dom'

const entryCache = new Map<string, Entry>()

async function fetchEntry(projectId: string, entryId: string) {
	if (entryCache.has(entryId)) return entryCache.get(entryId)

	const serializedEntry: SerializedEntry = await fetchJson(`/api/projects/${projectId}/documents/${encodeURIComponent(entryId)}`)
	if (serializedEntry == null) return

	const entry = deserializeEntry(serializedEntry)
	entryCache.set(entry.id, entry)

	return entry
}

export function EntryProvider(props: { children: React.ReactNode }) {
	const history = useHistory()
	const [entry, _setEntry] = React.useState<Entry>(null)
	const [initialFacsimileId, setFacsimileId] = React.useState<string>(null)
	const [initialEntityIds, setEntityIds] = React.useState<Set<string>>(null)
	const { projectId, entryId } = useParams()

	React.useEffect(() => {
		if (projectId == null || entryId === entry?.id) return

		if (entryId == null && entry != null) {
			_setEntry(null)
		} else {
			fetchEntry(projectId, entryId).then(_setEntry)
		}
	}, [projectId, entryId])

	const setEntry = React.useCallback((props: SetEntryProps) => {
		fetchEntry(projectId, props.entryId).then(entry => {
			_setEntry(entry)
			if (props.facsimileId != null) setFacsimileId(props.facsimileId)
			if (props.entityIds != null) setEntityIds(props.entityIds)
			history.push(getEntryPath(projectId, props.entryId, {
				facsimileId: new Set([props.facsimileId]),
				entityId: props.entityIds,

			}))
		})
	}, [projectId])

	if (entry == null) return null

	return (
		<EntryContext.Provider value={{ entry, initialFacsimileId, initialEntityIds, setEntry }}>
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
