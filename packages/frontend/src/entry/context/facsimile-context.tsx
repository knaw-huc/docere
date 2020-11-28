import React from 'react'
import { EntryContext, ID, FacsimileContext, ActiveFacsimile, useUrlQuery } from '@docere/common'

export function FacsimileProvider(props: { children: React.ReactNode }) {
	const { entry } = React.useContext(EntryContext)
	const [facsimile, setFacsimile] = React.useState<ActiveFacsimile>(null)
	const query = useUrlQuery()

	React.useEffect(() => {
		if (entry == null) return

		const fromQuery = query?.facsimileId != null

		const activeFacsimileId = fromQuery ?
			query.facsimileId.values().next().value :
			entry.textData.facsimiles.values().next().value.id

		if (!entry.textData.facsimiles.has(activeFacsimileId)) return

		setFacsimile({
			...entry.textData.facsimiles.get(activeFacsimileId),
			layerId: null,
			triggerLayerId: null,
		})
	}, [entry, query?.facsimileId])

	const setActiveFacsimile = React.useCallback((facsimileId: ID, triggerLayerId: ID, layerId: ID) => {
		setFacsimile({
			...entry.textData.facsimiles.get(facsimileId),
			layerId,
			triggerLayerId,
		})
	}, [entry, query])

	return (
		<FacsimileContext.Provider value={{ activeFacsimile: facsimile, setActiveFacsimile }}>
			{props.children}
		</FacsimileContext.Provider>
	) 
}
