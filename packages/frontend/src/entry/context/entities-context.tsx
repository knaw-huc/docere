import React from 'react'
import { EntryContext, ID, ActiveEntity, EntitiesContext } from '@docere/common'

export function EntitiesProvider(props: { children: React.ReactNode }) {
	const { entry } = React.useContext(EntryContext)
	const [activeEntities, setActiveEntities] = React.useState<Map<ID, ActiveEntity>>(new Map())

	React.useEffect(() => {
		setActiveEntities(new Map())
	}, [entry])

	const addActiveEntity = React.useCallback((entityId: ID, triggerLayerId: ID, layerId: ID) => {
		if (activeEntities.has(entityId)) {
			activeEntities.delete(entityId)
		} else {
			const activeEntity = entry.textData.entities.get(entityId)
			activeEntities.set(entityId, {
				...activeEntity,
				layerId,
				triggerLayerId,
			})
		}
		setActiveEntities(new Map(activeEntities))
	}, [entry])

	return (
		<EntitiesContext.Provider value={{ activeEntities, addActiveEntity }}>
			{props.children}
		</EntitiesContext.Provider>
	) 
}
