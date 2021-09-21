import { DocereConfig, PartConfig } from '..'
import { isTextLayerConfig } from '../utils'
import { FacsimileLayer, ID, isEntityMetadataConfig, JsonEntry, TextLayer } from '.'
import { cloneAnnotation, PartialStandoff, PartialStandoffAnnotation } from '../standoff-annotations'
import { isChild } from '../standoff-annotations/utils'

export interface GetValueProps {
	annotation: PartialStandoffAnnotation
	projectConfig: DocereConfig
	sourceId: ID
	source: PartialStandoff
}

export interface CreateJsonEntryPartProps extends Omit<GetValueProps, 'annotation'> {
	id: ID
	partConfig?: PartConfig
	root?: PartialStandoffAnnotation
}

/**
 * Create JSON entry to store in the database and send over the wire. 
 */
export function createJsonEntry(props: CreateJsonEntryPartProps): JsonEntry {
	const layers = props.projectConfig.layers2
		.map(layerConfig => {
			if (isTextLayerConfig(layerConfig)) {
				let partialStandoff = props.source

				// TODO what happens when findRoot is defined in layerConfig and a root is
				// present from partConfig, should they be mutuallly exclusive?
				// Remove findRoot? If you want a part of the document, use partConfig?
				if (layerConfig.findRoot != null) {
					const newRoot = partialStandoff.annotations.find(layerConfig.findRoot)
					partialStandoff = createPartialStandoffFromAnnotation(partialStandoff, newRoot)
				} else if (props.root != null) {
					partialStandoff = createPartialStandoffFromAnnotation(partialStandoff, props.root)
				} else {
					partialStandoff = clonePartialStandoff(partialStandoff)
				}

				if (partialStandoff == null) return null

				if (props.partConfig != null) {
					partialStandoff.metadata = {
						sourceMetadata: { ...partialStandoff.metadata }
					}
				}
				const preparedPartialStandoff = props.projectConfig.standoff
					.prepareStandoff(partialStandoff, props)

				return {
					...layerConfig,
					partialStandoff: preparedPartialStandoff,
				} as TextLayer
			}

			return layerConfig as FacsimileLayer
		})
		.filter(x => x != null)

	const metadata = props.projectConfig.metadata2.map(metadataConfig => {
		let value

		if (isEntityMetadataConfig(metadataConfig)) {
			const entityConfig = props.projectConfig.entities2
				.find(ec => ec.id === metadataConfig.entityConfigId)

			value = props.source.annotations
				.filter(entityConfig.filter)
				.filter(metadataConfig.filterEntities)
				.map(a => entityConfig.getValue({
					...props,
					annotation: a
				}))
		} else {
			value = metadataConfig.getValue(metadataConfig, props, layers)
		}

		return {
			config: metadataConfig,
			value,
		}
	})

	return {
		id: props.id,
		layers,
		metadata,
		partId: props.partConfig?.id,
		sourceId: props.sourceId,
	}
}

/**
 * Create a {@link PartialStandoff} from a {@link PartialStandoffAnnotation}
 * 
 * The new root can be an annotation from the original partial standoff, but
 * it can also be a whole new annotation. That's why the new root is filtered
 * out first, and concatenated later. The new root does not have to be sorted,
 * because the annotations in {@link PartialStandoff} don't have an order
 */
function createPartialStandoffFromAnnotation(
	partialStandoff: PartialStandoff,
	newRoot: PartialStandoffAnnotation
) {
	// Get the text first, because the root's offsets are to be shifted
	const text = partialStandoff.text.slice(newRoot.start, newRoot.end)

	const offset = newRoot.start
	const annotations = partialStandoff.annotations
		.filter(a => isChild(a, newRoot) && a !== newRoot) // filter out the new root
		.concat(newRoot) // concatenate the new root

	const clone = clonePartialStandoff({
		annotations,
		metadata: partialStandoff.metadata,
		text
	})

	clone.annotations.forEach(a => {
		a.start = a.start - offset
		a.end = a.end - offset
	})

	return clone
}

function clonePartialStandoff(partialStandoff: PartialStandoff): PartialStandoff {
	return {
		annotations: partialStandoff.annotations.map(a => cloneAnnotation(a, false)),
		metadata: JSON.parse(JSON.stringify(partialStandoff.metadata)),
		text: partialStandoff.text
	}
}
