import { JsonEntry, ElasticSearchDocument, MetadataItem, DocereConfig, isTextLayer, PartialStandoffAnnotation } from "@docere/common"
import { isHierarchyMetadataItem } from "@docere/common"
import { DocereApiError } from "../types"
import { isError } from "../utils"

/**
 * Convert a {@link JsonEntry | JSON Entry} to an {@link ElasticSearchDocument}
 */
export function createElasticSearchDocument(
	jsonEntry: JsonEntry | DocereApiError,
	projectConfig: DocereConfig
): ElasticSearchDocument | DocereApiError {
	if (isError(jsonEntry)) return jsonEntry

	const textLayers = jsonEntry.layers.filter(isTextLayer)

	const annotations = textLayers
		.reduce<PartialStandoffAnnotation[]>(
			(prev, curr) => prev.concat(curr.partialStandoff.annotations),
			[]
		)

	const entities = annotations
		.reduce((map, curr) => {
			if (curr.props.entityValue != null) {
				const { entityConfigId: configId } = curr.props;

				(map.has(configId)) ?
					map.get(configId).add(curr.props.entityValue) :
					map.set(configId, new Set([curr.props.entityValue]))
			}

			return map
		}, new Map<string, Set<string>>())

	const entities2 = Array.from(entities).reduce((prev, curr) => {
		const [configId, valueSet] = curr
		prev[configId] = Array.from(valueSet)
		return prev
	}, {} as Record<string, string[]>)

	console.log(entities2)

	const facsimiles = projectConfig.facsimiles != null ? 
		annotations
			/**
			 * Don't use the {@link DocereConfig.facsimiles.filter | facsimile filter},
			 * but just check if the annotation has a facsimile ID and path.
			 * 
			 * For example when a source document is splitted in parts,
			 * a part could be without a facsimile, but added later in
			 * the {@link DocereConfig.partsConfig.prepareStandoff}
			 */
			.filter(a =>
				a.props.facsimileId != null &&
				a.props.facsimilePath != null
			)
			.map(a => ({
				id: a.props.facsimileId,
				path: a.props.facsimilePath
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

	const text = textLayers.reduce((prev, curr) => `${prev}${curr.partialStandoff.text}`, '')

	const textSuggestLines = text
		.replace(/\s+/g, ' ')
		.replace(/\.|\,|\;/g, '')
		.split(' ')
		.map(line => line.trim())
		.filter(line => line.length > 0)
	const textSuggestInput = Array.from(new Set(textSuggestLines))

	return {
		id: jsonEntry.id,
		facsimiles,
		text,
		text_suggest: {
			input: textSuggestInput
		},
		...entities2,
		...metadata,
	}
}
