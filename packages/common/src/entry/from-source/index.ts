import { createJsonEntry, GetValueProps, JsonEntry } from ".."
import { DocereConfig, PartialStandoff } from "../.."

import { prepareSource } from './prepare-source'
export { prepareSource }
// 	// const sourceTree = await getSourceTree(source, projectConfig)
// 	const partialStandoff = await prepareSource(source, projectConfig)

// TODO remove prepareAnnotations from DocereConfig

// export async function getSourceTree(source: string | object, projectConfig: DocereConfig) {
// 	const partialStandoff = await prepareSource(source, projectConfig)
// 	// const tree = new StandoffTree(partialStandoff, projectConfig.standoff.exportOptions)
// 	// projectConfig.standoff.prepareAnnotations(tree)
// 	return partialStandoff
// 	// return tree
// }

/**
 * Create the entries from the {@link PartialStandoff | partial standoff} source
 */
export async function getEntriesFromSource(
	sourceId: string,
	source: PartialStandoff,
	projectConfig: DocereConfig
) {

	for (const annotation of source.annotations) {
		const props: GetValueProps = {
			annotation,
			projectConfig,
			sourceId,
			partialStandoff: source
		}

		const entityConfig = projectConfig.entities2.find(ec => ec.filter(annotation))
		if (entityConfig != null) {
			annotation.props.entityConfigId = entityConfig.id
			annotation.props.entityId = entityConfig.getId(annotation)
			annotation.props.entityValue = entityConfig.getValue(props)
		}

		if (projectConfig.facsimiles?.filter(annotation)) {
			annotation.props.facsimileId = projectConfig.facsimiles.getId(annotation)
			annotation.props.facsimilePath = projectConfig.facsimiles.getPath(props)
		}
	}

	const entries: JsonEntry[] = []

	if (Array.isArray(projectConfig.parts)) {
		for (const partConfig of projectConfig.parts) {
			// If partConfig.filter is defined, use it it get the roots,
			// if no filter is defined, use null
			const roots = partConfig.filter != null ?
				source.annotations.filter(partConfig.filter) : //.slice(0, 10) :
				[null]

			for (const root of roots) {
				const id = root != null && partConfig.getId != null ?
					partConfig.getId(root) :
					sourceId

				const entry = createJsonEntry({
					id,
					partConfig,
					projectConfig,
					root,
					sourceId,
					partialStandoff: source,
				})

				entries.push(entry)
			}
		}
	} else {
		const entry = createJsonEntry({
			id: sourceId,
			projectConfig,
			sourceId,
			partialStandoff: source,
		})

		entries.push(entry)
	}

	return entries
}
