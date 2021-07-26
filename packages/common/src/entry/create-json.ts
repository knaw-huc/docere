import { DocereConfig, PartConfig, StandoffAnnotation, StandoffTree } from '..'
import { isTextLayerConfig } from '../utils'
import { FacsimileLayer, ID, isEntityMetadataConfig, JsonEntry, TextLayer } from '.'

export interface GetValueProps {
	annotation: StandoffAnnotation
	projectConfig: DocereConfig
	sourceId: ID
	sourceTree: StandoffTree
}

export interface CreateJsonEntryPartProps extends Omit<GetValueProps, 'annotation'> {
	id: ID
	partConfig?: PartConfig
	root?: StandoffAnnotation
}

// export function isEntryPart(props: CreateJsonEntryPartProps): props is CreateJsonEntryPartProps {
// 	return props.hasOwnProperty('sourceProps') && props.hasOwnProperty('partConfig')
// }

/**
 * Create JSON entry to store in the database and send over the wire. 
 * 
 * @param props 
 * @returns 
 */
export function createJsonEntry(props: CreateJsonEntryPartProps): JsonEntry {
	const layers = props.projectConfig.layers2
		.map(layerConfig => {
			if (isTextLayerConfig(layerConfig)) {
				let tree = props.sourceTree

				if (layerConfig.findRoot != null) {
					tree = props.sourceTree.createStandoffTreeFromAnnotation(layerConfig.findRoot)
					if (tree == null) return null
				} else if (props.root != null) {
					tree = props.sourceTree.createStandoffTreeFromAnnotation(props.root)
				}

				// TODO check if tree is an EntryPart?
				props.projectConfig.standoff.prepareExport(tree)

				return {
					...layerConfig,
					tree: tree.exportReactTree()
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

			value = props.sourceTree.annotations
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

	// if (props.partConfig != null) {
	// 	metadata.push({
	// 		config: { id: '_partId', facet: {} },
	// 		value: props.partConfig.id
	// 	})
	// }

	return {
		id: props.id,
		layers,
		metadata,
	}
}
