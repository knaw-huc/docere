import type { ID } from './layer'
import type { SerializedEntry, Entry, Entity } from './index'
import { DocereAnnotation } from '../standoff-annotations'
import { generateId, isTextLayer } from '../utils'
import { DocereConfig } from '../types/config-data/config'

// function deserializeEntities(entities: SerializedLayer['entities']): Layer['entities'] {
// 	const settedEntities: [Type, Set<ID>][] = entities.map(x => [x[0], new Set(x[1])])
// 	return new Map(settedEntities)
// }

// function deserializeLayer(layer: SerializedLayer): Layer {
// 	return {
// 		...layer,
// 		// entityIds: new Set(layer.entityIds),
// 		// facsimileIds: new Set(layer.facsimileIds),
// 		// entities: deserializeEntities(layer.entities),
// 		// facsimiles: new Set(layer.facsimiles),
// 	}
// }

/**
 * Converts the serialized entry, which is stored in the database to 
 * the entry used in the client. The main difference is that Arrays
 * are converted to iterators (Set, Map)
 * 
 * @param entry - the serialized entry 
 * @return Entry - the deserialized entry, used in the client
 * @todo fix the type errors on the layer conversion
 */
export function deserializeEntry(entry: SerializedEntry, config: DocereConfig): Entry {
	// const layers = entry.layers.map(deserializeLayer)

	return ({
		...entry,
		textData: {
			entities: createEntityLookup(entry.layers, config),
			facsimiles: new Map(entry.textData.facsimiles)
		}
	})
}

function isEntity(annotation: DocereAnnotation): annotation is Entity {
	return annotation.props._entityId != null
}

function addEntity(
	root: DocereAnnotation | string,
	map: Map<ID, DocereAnnotation>,
	config: DocereConfig
) {
	if (typeof root === 'string') return
	if (isEntity(root)) {
		root.props._config = config.entities2.find(ec => ec.id === root.props._entityConfigId)
		root.props._areas?.forEach(a => {
			if (a.id == null) a.id = generateId()
		})
		map.set(root.props._entityId, root)
	}
	root.children?.forEach(child => addEntity(child, map, config))
}

function createEntityLookup(layers: Entry['layers'], config: DocereConfig): Map<ID, Entity> {
	const entities = new Map<ID, Entity>()

	layers.forEach(layer => {
		if (isTextLayer(layer)) {
			addEntity(layer.tree, entities, config)
		}
	})

	return entities
}
