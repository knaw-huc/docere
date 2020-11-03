import { LayerConfig, SerializedLayer, Type, ID, SerializedTextLayer, SerializedFacsimileLayer } from '../../config-data/layer'
import { isTextLayerConfig, setTitle, Entity, DocereConfig, xmlToString } from '../../..'
import { ConfigEntry } from '..'
import { isFacsimileLayerConfig } from '../../../utils'

/**
 * Entities are extracted as a list (Array), but for further processing
 * the entities should be mapped by their type.
 * 
 * @param entities
 */
function mapEntitiesByType(entities: Entity[]): SerializedLayer['entities'] {
	if (!Array.isArray(entities)) return null

	const mappedEntities = entities
		.reduce((prev, curr) => {
			const idsByType = prev.get(curr.type)
			if (idsByType == null) prev.set(curr.type, [curr.id])
			else prev.set(curr.type, idsByType.concat(curr.id))
			return prev
		}, new Map<Type, ID[]>())

	return Array.from(mappedEntities)
}

function serializeBaseLayer(
	layer: LayerConfig,
	entry: ConfigEntry,
	parent: ConfigEntry
) {
	const filterEntities = layer.filterEntities != null ? layer.filterEntities : () => () => true
	const filterFacsimiles = layer.filterFacsimiles != null ? layer.filterFacsimiles : () => () => true

	return {
		active: layer.active != null ? layer.active : true,
		entities: mapEntitiesByType(parent.entities?.filter(filterEntities(entry))),
		facsimiles: parent.facsimiles?.filter(filterFacsimiles(entry)).map(e => e.id),
		id: layer.id,
		pinned: layer.pinned != null ? layer.pinned : false,
		title: layer.title,
	}
}

export function serializeLayer(
	entry: ConfigEntry,
	parent: ConfigEntry,
	config: DocereConfig
) {
	return function(layer: LayerConfig): SerializedLayer {

		if (isTextLayerConfig(layer)) {
			const extractContent = layer.extract == null ? (entry: ConfigEntry) => entry.element : layer.extract

			const l: SerializedTextLayer = {
				...layer,
				...serializeBaseLayer(layer, entry, parent),
				content: xmlToString(extractContent(entry, config)),
			}

			return setTitle(l)
		} else if (isFacsimileLayerConfig(layer)) {
			const l: SerializedFacsimileLayer = {
				...layer,
				...serializeBaseLayer(layer, entry, parent),
			}

			return setTitle(l)
		}
	}
}
