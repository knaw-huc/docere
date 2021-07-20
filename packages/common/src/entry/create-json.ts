import { DocereConfig, PartConfig, StandoffAnnotation, StandoffTree } from '..'
import { isTextLayerConfig } from '../utils'
import { FacsimileLayer, ID, isEntityMetadataConfig, JsonEntry, TextLayer } from '.'

export interface GetValueProps {
	config: DocereConfig
	id: ID
	tree: StandoffTree
}

export interface CreateJsonEntryPartProps {//extends Omit<CreateJsonEntryProps, 'tree'> {
	config: DocereConfig
	id: ID
	partConfig?: PartConfig
	root: StandoffAnnotation
	sourceTree: StandoffTree
	// sourceProps: CreateJsonEntryProps
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
	// const sourceTree = isEntryPart(props) ?
	// 	props.sourceProps.tree : //.createStandoffTreeFromAnnotation(props.root) :
	// 	props.tree

	const layers = props.config.layers2
		.map(layerConfig => {
			if (isTextLayerConfig(layerConfig)) {
				let tree = props.sourceTree

				if (layerConfig.findRoot != null) {
					tree = props.sourceTree.createStandoffTreeFromAnnotation(layerConfig.findRoot)
					if (tree == null) return null
				} else if (props.root != null) {
					tree = props.sourceTree.createStandoffTreeFromAnnotation(props.root)
				} else {
					console.error('No root foudn')
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
		.filter(x => x != null)

	const metadata = props.config.metadata2.map(metadataConfig => {
		let value

		if (isEntityMetadataConfig(metadataConfig)) {
			const entityConfig = props.config.entities2
				.find(ec => ec.id === metadataConfig.entityConfigId)

			value = props.sourceTree.annotations
				.filter(entityConfig.filter)
				.filter(metadataConfig.filterEntities)
				.map(a => entityConfig.getValue(a, props))
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
