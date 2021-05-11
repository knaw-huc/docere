import React from 'react'
import { ID } from '.'
import { EntityConfig2, EntryContext } from '..'
import { ContainerType } from '../enum'
import { DocereAnnotation } from '../standoff-annotations'

/**
 * An Entity is a kind of {@link DocereAnnotation}. After
 * an entry is fetched from the server, the DocereAnnotation's
 * which are entities are extended with a reference to the 
 * entities config (found in {@link DocereConfig}). The config is needed
 * often because it contains information on the render: the color,
 * if should be rendered on the aside, etc.
 */
export interface Entity extends DocereAnnotation {
	props: DocereAnnotation['props'] & {
		_config: EntityConfig2
	}
}

// Active entity
export type ActiveEntity = Entity & TriggerContainer

export interface TriggerContainer {
	triggerContainer?: ContainerType
	triggerContainerId?: ID
}

export function useEntity(id: string) {
	const entry = React.useContext(EntryContext)

	const [entity, setEntity] = React.useState<Entity>(null)

	React.useEffect(() => {
		const _entity = entry.textData.entities.get(id)
		setEntity(_entity)
	}, [entry, id])

	return entity
}
