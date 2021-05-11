import React from 'react'
import { ID } from '.'
import { EntityConfig2, EntryContext, ProjectContext } from '..'
import { ContainerType } from '../enum'
import { DocereAnnotation } from '../standoff-annotations'

// Extracted entity
// export interface ExtractedCommon {
// 	anchor: Element
// 	layerId?: ID
// }

// export interface ExtractedEntity extends ExtractedCommon, Omit<EntityConfig, 'extract' | 'extractId' | 'id' | 'selector'> {
// 	attributes?: Record<string, string>
// 	configId?: string
// 	content: string
// 	count?: number
// 	facsimileAreas?: FacsimileArea[]
// 	id?: string /* ID is optional, because it is extracted by EntityConfig.extractId */
// 	n?: string
// }

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

interface Output {
	entity: Entity,
	entityConfig: EntityConfig2
}

export function useEntity(id: string) {
	const entry = React.useContext(EntryContext)
	const { config } = React.useContext(ProjectContext)

	const [output, setOutput] = React.useState<Output>({ entity: null, entityConfig: null })

	React.useEffect(() => {
		const entity = entry.textData.entities.get(id)
		const entityConfig = config.entities2.find(e => e.id === entity.props._entityConfigId)
		setOutput({ entity, entityConfig })
	}, [entry, id])

	return output
}
