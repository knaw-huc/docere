import { isTextLayerConfig, xmlToString } from '../../utils'
import { isFacsimileLayerConfig } from '../../utils'

import type { SerializedLayer, Type, ID, SerializedTextLayer, SerializedFacsimileLayer, ExtractedLayer } from '.'
import type { ExtractedEntity } from '../entity' 
import { setTitle } from '../../extend-config-data'
import { DocereConfig } from '../../types/config-data/config'

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

function serializeBaseLayer(layer: ExtractedLayer, config: DocereConfig) {
	const layerConfig = config.layers.find(l => l.id === layer.id)
	return {
		active: layer.active != null ? layer.active : layerConfig.active,
		entities: mapEntitiesByType(layer.entities),
		facsimiles: layer.facsimiles.map(f => f.id),
		id: layer.id,
		pinned: layer.pinned != null ? layer.pinned : layerConfig.pinned,
		title: layer.title,
	}
}

export function serializeLayer(config: DocereConfig) {
	return function(layer: ExtractedLayer): SerializedLayer {
		if (isTextLayerConfig(layer)) {
			const l: SerializedTextLayer = {
				...layer,
				...serializeBaseLayer(layer, config),
				content: xmlToString(layer.el),
			}

			return setTitle(l)
		} else if (isFacsimileLayerConfig(layer)) {
			const l: SerializedFacsimileLayer = {
				...layer,
				...serializeBaseLayer(layer, config),
			}

			return setTitle(l)
		}
	}
}
