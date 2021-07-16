import { DocereConfig, PartConfig, StandoffAnnotation, StandoffTree } from '..'
import { isTextLayerConfig } from '../utils'
import { FacsimileLayer, ID, isEntityMetadataConfig, JsonEntry, TextLayer } from '.'

export interface CreateJsonEntryProps {
	config: DocereConfig
	id: ID
	tree: StandoffTree
}

export interface CreateJsonEntryPartProps extends Omit<CreateJsonEntryProps, 'tree'> {
	partConfig: PartConfig
	root: StandoffAnnotation
	sourceProps: CreateJsonEntryProps
}

export function isEntryPart(props: CreateJsonEntryProps | CreateJsonEntryPartProps): props is CreateJsonEntryPartProps {
	return props.hasOwnProperty('sourceProps') && props.hasOwnProperty('partConfig')
}

/**
 * Create JSON entry to store in the database and send over the wire. 
 * 
 * @param props 
 * @returns 
 */
export function createJsonEntry(props: CreateJsonEntryProps | CreateJsonEntryPartProps): JsonEntry {
	const sourceTree = isEntryPart(props) ?
		props.sourceProps.tree : //.createStandoffTreeFromAnnotation(props.root) :
		props.tree

	return {
		id: props.id,

		layers: props.config.layers2
			.map(layerConfig => {
				if (isTextLayerConfig(layerConfig)) {
					let tree = sourceTree
					if (layerConfig.findRoot != null) {
						tree = sourceTree.createStandoffTreeFromAnnotation(layerConfig.findRoot)
						if (tree == null) return null
					} else if (isEntryPart(props)) {
						tree = sourceTree.createStandoffTreeFromAnnotation(props.root)
					}

					// TODO check if tree is an EntryPart?
					props.config.standoff.prepareExport(tree)

					return {
						...layerConfig,
						tree: tree.exportReactTree()
					} as TextLayer
				} 

				return layerConfig as FacsimileLayer
			})
			.filter(x => x != null),

		metadata: props.config.metadata2.map(metadataConfig => {
			let value

			if (isEntityMetadataConfig(metadataConfig)) {
				const entityConfig = props.config.entities2.find(ec => ec.id === metadataConfig.entityConfigId)
				value = sourceTree.annotations
					.filter(entityConfig.filter)
					.filter(metadataConfig.filterEntities)
					.map(a => entityConfig.getValue(a, props))
			} else {
				value = metadataConfig.getValue(metadataConfig, props)
			}

			return {
				config: metadataConfig,
				value,
			}
		}),
	}
}
