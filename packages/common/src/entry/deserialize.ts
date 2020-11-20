import type { Layer, SerializedLayer, ID, Type } from './layer'
import type { SerializedEntry, Entry } from './index'

function deserializeEntities(entities: SerializedLayer['entities']): Layer['entities'] {
	const settedEntities: [Type, Set<ID>][] = entities.map(x => [x[0], new Set(x[1])])
	return new Map(settedEntities)
}

function deserializeLayer(layer: SerializedLayer): Layer {
	return {
		...layer,
		entities: deserializeEntities(layer.entities),
		facsimiles: new Set(layer.facsimiles),
	}
}

/**
 * Converts the serialized entry, which is stored in the database to 
 * the entry used in the client. The main difference is that Arrays
 * are converted to iterators (Set, Map)
 * 
 * @param entry - the serialized entry 
 * @return Entry - the deserialized entry, used in the client
 * @todo fix the type errors on the layer conversion
 */
export function deserializeEntry(entry: SerializedEntry): Entry {
	return ({
		...entry,
		layers: entry.layers.map(deserializeLayer),
		textData: {
			entities: new Map(entry.textData.entities),
			facsimiles: new Map(entry.textData.facsimiles)
		}
	})
}
