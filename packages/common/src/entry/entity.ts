import { ID } from '.'
import { EntityConfig, FacsimileArea } from '..'
import { defaultEntityConfig } from '../types/config-data/config'

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
export interface ActiveEntity extends Entity {
	layerId: ID
	triggerLayerId: ID
}
