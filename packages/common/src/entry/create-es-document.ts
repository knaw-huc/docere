import { DocereConfig, ElasticSearchDocument, isTextLayer, PartialStandoffAnnotation, isHierarchyMetadataConfig } from '..';
import { JsonEntry } from '.'

/**
 * Convert a {@link JsonEntry | JSON Entry} to an {@link ElasticSearchDocument}
 */
export function createElasticSearchDocument(
	jsonEntry: JsonEntry,
	projectConfig: DocereConfig
): ElasticSearchDocument {
	const textLayers = jsonEntry.layers.filter(isTextLayer)

	const annotations = textLayers
		.reduce<PartialStandoffAnnotation[]>(
			(prev, curr) => prev.concat(curr.partialStandoff.annotations),
			[]
		)

	const entitiesWithFacets = projectConfig.entities2
		.filter(e => e.facet != null)
		.map(e => e.id)

	const entities = annotations
		.reduce((map, curr) => {
			if (curr.props.entityValue != null) {
				const { entityConfigId: configId } = curr.props
				if (entitiesWithFacets.indexOf(configId) === -1) return map 

				if (map.has(configId)) 
					map.get(configId).add(curr.props.entityValue as string)
				else
					map.set(configId, new Set([curr.props.entityValue as string]))
			}

			return map
		}, new Map<string, Set<string>>())

	const entities2 = Array.from(entities).reduce((prev, curr) => {
		const [configId, valueSet] = curr
		prev[configId] = Array.from(valueSet)
		return prev
	}, {} as Record<string, string[]>)

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
			.reduce((prev, a) => {
				if (prev.find(x => x.id === a.props.facsimileId) == null) {
					prev.push({
						id: a.props.facsimileId,
						path: a.props.facsimilePath
					})
				}
				return prev
			}, []) :
		[]

	const metadata = Object.keys(jsonEntry.metadata).reduce((prev, curr) => {
		const value = jsonEntry.metadata[curr]
		const metadataConfig = projectConfig.metadata2.find(md => md.id === curr)

		if (isHierarchyMetadataConfig(metadataConfig)) {
			if (Array.isArray(value)) {
				value.forEach((v, i) => {
					prev[`${curr}_level${i}`] = v
				})
			}
		} else {
			prev[curr] = value
		}
		return prev
	}, {} as JsonEntry['metadata'])

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
