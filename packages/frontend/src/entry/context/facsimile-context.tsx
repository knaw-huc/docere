import React from 'react'
import { EntryContext, ID, FacsimileContext, ActiveFacsimile } from '@docere/common'

export function FacsimileProvider(props: { children: React.ReactNode }) {
	const { entry, initialFacsimileId } = React.useContext(EntryContext)
	const [facsimile, setFacsimile] = React.useState<ActiveFacsimile>(null)

	React.useEffect(() => {
		if (entry == null) return

		const activeFacsimileId = initialFacsimileId != null ?
			initialFacsimileId :
			entry.textData.facsimiles.values().next().value.id

		if (!entry.textData.facsimiles.has(activeFacsimileId)) return

		setFacsimile({
			...entry.textData.facsimiles.get(activeFacsimileId),
			layerId: null,
			triggerLayerId: null,
		})
	}, [entry, initialFacsimileId])

	const setActiveFacsimile = React.useCallback((facsimileId: ID, triggerLayerId: ID, layerId: ID) => {
		setFacsimile({
			...entry.textData.facsimiles.get(facsimileId),
			layerId,
			triggerLayerId,
		})
	}, [entry])

	return (
		<FacsimileContext.Provider value={{ activeFacsimile: facsimile, setActiveFacsimile }}>
			{props.children}
		</FacsimileContext.Provider>
	) 
}
