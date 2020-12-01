// import React from 'react'
// import { EntryContext, ProjectState } from '@docere/common'

// export function EntryProvider(props: { children: React.ReactNode, state: ProjectState }) {
// 	return (
// 		<EntryContext.Provider value={props.state.entry}>
// 			{props.children}
// 		</EntryContext.Provider>
// 	) 
// }

// export function EntryProvider(props: { children: React.ReactNode }) {
// 	const history = useHistory()
// 	const [entry, _setEntry] = React.useState<Entry>(null)
// 	const [initialFacsimileId, setFacsimileId] = React.useState<string>(null)
// 	const [initialEntityIds, setEntityIds] = React.useState<Set<string>>(null)
// 	const { projectId, entryId } = useParams()

// 	React.useEffect(() => {
// 		if (projectId == null || entryId === entry?.id) return

// 		if (entryId == null && entry != null) {
// 			_setEntry(null)
// 		} else {
// 			fetchEntry(projectId, entryId).then(_setEntry)
// 		}
// 	}, [projectId, entryId])

// 	const setEntry = React.useCallback((props: SetEntryProps) => {
// 		fetchEntry(projectId, props.entryId).then(entry => {
// 			_setEntry(entry)
// 			if (props.facsimileId != null) setFacsimileId(props.facsimileId)
// 			if (props.entityIds != null) setEntityIds(props.entityIds)
// 			history.push(getEntryPath(projectId, props.entryId, {
// 				facsimileId: new Set([props.facsimileId]),
// 				entityId: props.entityIds,

// 			}))
// 		})
// 	}, [projectId])

// 	if (entry == null) return null

// 	return (
// 		<EntryContext.Provider value={{ entry, initialFacsimileId, initialEntityIds, setEntry }}>
// 			{props.children}
// 		</EntryContext.Provider>
// 	) 
// }
