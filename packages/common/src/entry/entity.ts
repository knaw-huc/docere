import React from 'react'
import { ID } from '.'
import { EntityConfig, FacsimileArea, EntryContext } from '..'
import { defaultEntityConfig } from '../types/config-data/config'
import { ContainerType } from '../enum'

// Extracted entity
export interface ExtractedCommon {
	anchor: Element
	layerId?: ID
}

export interface ExtractedEntity extends ExtractedCommon, Omit<EntityConfig, 'extract' | 'extractId' | 'id' | 'selector'> {
	attributes?: Record<string, string>
	configId?: string
	content: string
	count?: number
	facsimileAreas?: FacsimileArea[]
	id?: string /* ID is optional, because it is extracted by EntityConfig.extractId */
	n?: string
}

// Entity
export type Entity = Required<Omit<ExtractedEntity, 'anchor'>>

export const defaultEntity: Entity = {
	...defaultEntityConfig,
	attributes: null,
	configId: null,
	content: null,
	count: null,
	facsimileAreas: null,
	id: null,
	layerId: null,
	n: null
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
