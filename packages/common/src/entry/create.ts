import type { ID } from './layer'
import { JsonEntry, Entry, Entity, Facsimile, isEntityAnnotation, isFacsimileAnnotation } from './index'
import { DocereAnnotation } from '../standoff-annotations'
import { generateId, isTextLayer } from '../utils'
import { DocereConfig } from '../config'
import { EntityConfig } from './entity'

/**
 * Converts the serialized entry, which is stored in the database to 
 * the entry used in the client.
 * 
 * The main difference is that textData (entities, facsimiles) is added
 * 
 * @param entry - the serialized entry 
 * @return Entry - the deserialized entry, used in the client
 * @todo fix the type errors on the layer conversion
 */
export function createEntry(entry: JsonEntry, config: DocereConfig): Entry {
	return ({
		...entry,
		textData: {
			entities: createEntityLookup(entry.layers, config),
			facsimiles: createFacsimileLookup(entry.layers)
		}
	})
}

function addEntity(
	root: DocereAnnotation | string,
	entitiesById: Map<ID, Entity>,
	entityConfigsById: Map<ID, EntityConfig>
) {
	if (typeof root === 'string') return
	if (isEntityAnnotation(root)) {
		root.props._config = entityConfigsById.get(root.props._entityConfigId)
		// TODO generate area ID in preprocessing step?
		root.props._areas?.forEach(a => {
			if (a.id == null) a.id = generateId()
		})
		entitiesById.set(root.props._entityId, root)
	}
	root.children?.forEach(child => addEntity(child, entitiesById, entityConfigsById))
}

function createEntityLookup(layers: Entry['layers'], config: DocereConfig): Map<ID, Entity> {
	const entitiesById = new Map<ID, Entity>()
	const entityConfigsById = config.entities2.reduce<Map<ID, EntityConfig>>((prev, curr) => {
		prev.set(curr.id, curr)
		return prev
	}, new Map())

	layers
		.filter(isTextLayer)
		.forEach(layer => addEntity(layer.tree, entitiesById, entityConfigsById))

	return entitiesById
}

function addFacsimile(
	root: DocereAnnotation | string,
	map: Map<ID, DocereAnnotation>
) {
	if (typeof root === 'string') return
	if (isFacsimileAnnotation(root)) {
		map.set(root.props._facsimileId, root)
	}
	root.children?.forEach(child => addFacsimile(child, map))
}

function createFacsimileLookup(layers: Entry['layers']): Map<ID, Facsimile> {
	const facsimiles = new Map<ID, Facsimile>()

	layers.forEach(layer => {
		if (isTextLayer(layer)) {
			addFacsimile(layer.tree, facsimiles)
		}
	})

	return facsimiles
}
