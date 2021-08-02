import { createJsonEntry, GetValueProps, JsonEntry } from ".."
import { DocereConfig, StandoffTree } from "../.."
import { prepareSource } from './prepare-source'

export async function getSourceTree(source: string | object, projectConfig: DocereConfig) {
	const partialStandoff = await prepareSource(source, projectConfig)
	const tree = new StandoffTree(partialStandoff, projectConfig.standoff.exportOptions)
	projectConfig.standoff.prepareAnnotations(tree)
	return tree
}

export async function getEntriesFromSource(
	sourceId: string,
	source: string | object,
	projectConfig: DocereConfig
) {
	const sourceTree = await getSourceTree(source, projectConfig)

	sourceTree.list.forEach(annotation => {
		const props: GetValueProps = {
			annotation,
			projectConfig,
			sourceId,
			sourceTree,
		}

		const entityConfig = projectConfig.entities2.find(ec => ec.filter(annotation))
		if (entityConfig != null) {
			annotation.metadata._entityConfigId = entityConfig.id
			annotation.metadata._entityId = entityConfig.getId(annotation)
			annotation.metadata._entityValue = entityConfig.getValue(props)
		}

		if (projectConfig.facsimiles?.filter(annotation)) {
			annotation.metadata._facsimileId = projectConfig.facsimiles.getId(annotation)
			annotation.metadata._facsimilePath = projectConfig.facsimiles.getPath(props)
		}
	})

	const entries: JsonEntry[] = []

	if (Array.isArray(projectConfig.parts)) {
		for (const partConfig of projectConfig.parts) {
			// If partConfig.filter is defined, use it it get the roots,
			// if no filter is defined, use the root of the tree
			const roots = partConfig.filter != null ?
				sourceTree.filter(partConfig.filter).slice(0, 10) :
				[sourceTree.root]

			for (const root of roots) {
				const id = partConfig.getId != null ?
					partConfig.getId(root) :
					sourceId

				const entry = createJsonEntry({
					id,
					partConfig,
					projectConfig,
					root,
					sourceId,
					sourceTree,
				})

				entries.push(entry)
			}
		}
	} else {
		const entry = createJsonEntry({
			id: sourceId,
			projectConfig,
			sourceId,
			sourceTree,
		})

		entries.push(entry)
	}

	return entries
}
