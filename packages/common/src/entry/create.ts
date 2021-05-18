import type { ID } from './layer'
import type { JsonEntry, Entry, Entity, Facsimile } from './index'
import { DocereAnnotation } from '../standoff-annotations'
import { generateId, isTextLayer } from '../utils'
import { DocereConfig } from '../config'
import { EntityConfig } from './entity'

/**
 * Converts the serialized entry, which is stored in the database to 
 * the entry used in the client. The main difference is that Arrays
 * are converted to iterators (Set, Map)
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

function isEntity(annotation: DocereAnnotation): annotation is Entity {
	return annotation.props._entityId != null
}

function isFacsimile(annotation: DocereAnnotation): annotation is Facsimile {
	return annotation.props._facsimileId != null
}

function addEntity(
	root: DocereAnnotation | string,
	map: Map<ID, Entity>,
	entityConfigs: Map<ID, EntityConfig>
) {
	if (typeof root === 'string') return
	if (isEntity(root)) {
		root.props._config = entityConfigs.get(root.props._entityConfigId)
		root.props._areas?.forEach(a => {
			if (a.id == null) a.id = generateId()
		})
		map.set(root.props._entityId, root)
	}
	root.children?.forEach(child => addEntity(child, map, entityConfigs))
}

function createEntityLookup(layers: Entry['layers'], config: DocereConfig): Map<ID, Entity> {
	const entities = new Map<ID, Entity>()
	const entityConfigs = config.entities2.reduce<Map<ID, EntityConfig>>((prev, curr) => {
		prev.set(curr.id, curr)
		return prev
	}, new Map())

	layers.forEach(layer => {
		if (isTextLayer(layer)) {
			addEntity(layer.tree, entities, entityConfigs)
		}
	})

	return entities
}

function addFacsimile(
	root: DocereAnnotation | string,
	map: Map<ID, DocereAnnotation>
) {
	if (typeof root === 'string') return
	if (isFacsimile(root)) {
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
