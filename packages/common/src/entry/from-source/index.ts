import { createJsonEntry, GetValueProps, JsonEntry } from ".."
import { DocereConfig, PartialStandoff } from "../.."

// import { prepareSource } from './prepare-source'
// export { prepareSource }
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
			source
		}

		const entityConfig = projectConfig.entities2.find(ec => ec.filter(annotation))
		if (entityConfig != null) {
			if (annotation.props == null) annotation.props = {}
			annotation.props.entityConfigId = entityConfig.id
			annotation.props.entityId = entityConfig.getId(props)
		}

		if (projectConfig.facsimiles?.filter(annotation)) {
			if (annotation.props == null) annotation.props = {}
			annotation.props.facsimileId = projectConfig.facsimiles.getId(props)
			annotation.props.facsimilePath = projectConfig.facsimiles.getPath(props)
		}
	}

	/**
	 * Add the entity value after all entityConfigId's and entityId's have bene added to the annotations,
	 * because the entity value can be a part (PartialStandoff) of the source. If entityConfig.getValue
	 * is executed in the first loop, a sub partial standoff could have annotations without the entityConfigId
	 * and entityId
	 */
	for (const annotation of source.annotations) {
		if (annotation.props.entityConfigId != null) {
			const entityConfig = projectConfig.entities2.find(ec => ec.id === annotation.props.entityConfigId)
			annotation.props.entityValue = entityConfig.getValue({
				annotation,
				projectConfig,
				sourceId,
				source
			})
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
					source,
				})

				entries.push(entry)
			}
		}
	} else {
		const entry = createJsonEntry({
			id: sourceId,
			projectConfig,
			sourceId,
			source,
		})

		entries.push(entry)
	}

	return entries
}
