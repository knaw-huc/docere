import React from 'react'
import { EntryContext, ID, FacsimileContext, ActiveFacsimile } from '@docere/common'

export function FacsimileProvider(props: { children: React.ReactNode }) {
	const entry = React.useContext(EntryContext)
	const [facsimile, setFacsimile] = React.useState<ActiveFacsimile>(null)

	React.useEffect(() => {
		setFacsimile(entry.textData.facsimiles.values().next().value)
	}, [entry])

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
