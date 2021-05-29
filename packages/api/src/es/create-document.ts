import { JsonEntry, Standoff, DocereConfig, ElasticSearchDocument, MetadataItem } from "@docere/common"
import { isHierarchyMetadataItem } from "@docere/common"
import { DocereApiError } from "../types"
import { isError } from "../utils"


export function createElasticSearchDocument(
	jsonEntry: JsonEntry | DocereApiError,
	standoff: Standoff,
	projectConfig: DocereConfig
): ElasticSearchDocument | DocereApiError {
	if (isError(jsonEntry)) return jsonEntry

	const entities = standoff.annotations
		.reduce((map, curr) => {
			if (curr.metadata._entityValue != null) {
				const { _entityConfigId: configId } = curr.metadata;

				(map.has(configId)) ?
					map.get(configId).add(curr.metadata._entityValue) :
					map.set(configId, new Set([curr.metadata._entityValue]))
			}

			return map
		}, new Map<string, Set<string>>())

	const entities2 = Array.from(entities).reduce((prev, curr) => {
		const [configId, valueSet] = curr
		prev[configId] = Array.from(valueSet)
		return prev
	}, {} as Record<string, string[]>)

	const facsimiles = projectConfig.facsimiles != null ? 
		standoff.annotations
			.filter(projectConfig.facsimiles.filter)
			.map(a => ({
				id: a.metadata._facsimileId,
				path: a.metadata._facsimilePath
			})) :
		[]

	const metadata = jsonEntry.metadata?.reduce((prev, curr) => {
			if (isHierarchyMetadataItem(curr)) {
				if (Array.isArray(curr.value)) {
					curr.value.forEach((v, i) => {
						prev[`${curr.config.id}_level${i}`] = v
					})
				}
			} else {
				prev[curr.config.id] = curr.value
			}
			return prev
		}, {} as Record<string, MetadataItem['value']>)

	return {
		id: jsonEntry.id,
		facsimiles,
		text: standoff.text,
		text_suggest: {
			input: Array.from(new Set(standoff.text.replace(/\.|\,|\;/g, '').split(' '))),
		},
		...entities2,
		...metadata,
	}
}