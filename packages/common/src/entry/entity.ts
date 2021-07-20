import React from 'react'
import { BaseMetadataConfig, ID } from '.'
import { EntryContext } from '..'
import { Colors, ContainerType, EntityType } from '../enum'
import { DocereAnnotation, PartialStandoffAnnotation } from '../standoff-annotations'
import { CreateJsonEntryPartProps, GetValueProps } from './create-json'

export interface EntityConfig extends BaseMetadataConfig {
	color?: string

	/**
	 * Filter entities from annotations
	 */
	filter: (annotation: PartialStandoffAnnotation) => boolean

	/**
	 * Get the content of the entity. The content is shown in the body
	 * of the entity visualisation
	 */ 
	getBody?: (
		a: PartialStandoffAnnotation,
		props: CreateJsonEntryPartProps
	) => PartialStandoffAnnotation

	/**
	 * Set the ID of the entity. Not te be confused with the annotation ID!
	 * An entity can consist of multiple annotations. Defaults to a.metadata._id
	 */
	getId?: (a: PartialStandoffAnnotation) => string

	/**
	 * Get the value of the entity. This is primarily used to show in 
	 * the faceted search and in the metadata tab
	 */ 
	getValue?: (
		a: PartialStandoffAnnotation,
		props: GetValueProps,
		// body?: PartialStandoffAnnotation
	) => string

	revealOnHover?: boolean

	type?: EntityType | string
}

export const defaultEntityConfig: Required<EntityConfig> = {
	color: Colors.Blue,
	facet: null,
	filter: null,
	getId: a => a.id,
	getValue: () => null,
	getBody: (a) => a,
	id: null,
	revealOnHover: false,
	showInAside: true,
	title: null,
	type: EntityType.None,
}

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
		_entityId: DocereAnnotation['props']['_entityId']
		_entityConfigId: DocereAnnotation['props']['_entityConfigId']
		_config: EntityConfig
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
