import { JsonEntry, ElasticSearchDocument, MetadataItem, CreateJsonEntryProps } from "@docere/common"
import { isHierarchyMetadataItem } from "@docere/common"
import { DocereApiError } from "../types"
import { isError } from "../utils"


export function createElasticSearchDocument(
	jsonEntry: JsonEntry | DocereApiError,
	createJsonEntryProps: CreateJsonEntryProps
): ElasticSearchDocument | DocereApiError {
	if (isError(jsonEntry)) return jsonEntry

	const { tree, config } = createJsonEntryProps

	const entities = tree.annotations
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

	const facsimiles = config.facsimiles != null ? 
		tree.annotations
			.filter(config.facsimiles.filter)
			.filter(a =>
				a.metadata._facsimileId != null &&
				a.metadata._facsimilePath != null
			)
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

	const textSuggestLines = tree.standoff.text
		.replace(/\s+/g, ' ')
		.replace(/\.|\,|\;/g, '')
		.split(' ')
		.map(line => line.trim())
		.filter(line => line.length > 0)
	const textSuggestInput = Array.from(new Set(textSuggestLines))

	return {
		id: jsonEntry.id,
		facsimiles,
		text: tree.standoff.text,
		text_suggest: {
			input: textSuggestInput
		},
		...entities2,
		...metadata,
	}
}
