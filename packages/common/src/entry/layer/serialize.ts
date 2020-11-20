import { isTextLayerConfig, xmlToString } from '../../utils'
import { isFacsimileLayerConfig } from '../../utils'

import type { SerializedLayer, Type, ID, SerializedTextLayer, SerializedFacsimileLayer, ExtractedLayer } from '.'
import type { ExtractedEntity } from '../entity' 
import { setTitle } from '../../extend-config-data'

/**
 * Entities are extracted as a list (Array), but for further processing
 * the entities should be mapped by their type.
 * 
 * @param entities
 */
function mapEntitiesByType(entities: ExtractedEntity[]): SerializedLayer['entities'] {
	if (!Array.isArray(entities)) return null

	const mappedEntities = entities
		.reduce((prev, entity) => {
			const idsByType = prev.get(entity.configId)
			if (idsByType == null) prev.set(entity.configId, [entity.id])
			else prev.set(entity.configId, idsByType.concat(entity.id))
			return prev
		}, new Map<Type, ID[]>())

	return Array.from(mappedEntities)
}

function serializeBaseLayer(layer: ExtractedLayer) {
	return {
		active: layer.active != null ? layer.active : true,
		entities: mapEntitiesByType(layer.entities),
		facsimiles: layer.facsimiles.map(f => f.id),
		id: layer.id,
		pinned: layer.pinned != null ? layer.pinned : false,
		title: layer.title,
	}
}

export function serializeLayer(layer: ExtractedLayer): SerializedLayer {
	if (isTextLayerConfig(layer)) {
		const l: SerializedTextLayer = {
			...layer,
			...serializeBaseLayer(layer),
			content: xmlToString(layer.el),
		}

		return setTitle(l)
	} else if (isFacsimileLayerConfig(layer)) {
		const l: SerializedFacsimileLayer = {
			...layer,
			...serializeBaseLayer(layer),
		}

		return setTitle(l)
	}
}
