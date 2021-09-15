import { AnnotationNode, DocereConfig, PartConfig, StandoffAnnotation, StandoffTree } from '..'
import { isTextLayerConfig } from '../utils'
import { FacsimileLayer, ID, isEntityMetadataConfig, JsonEntry, TextLayer } from '.'
// import { toDocereAnnotation } from '../standoff-annotations/export-react-tree'

export interface GetValueProps {
	annotation: StandoffAnnotation
	projectConfig: DocereConfig
	sourceId: ID
	sourceTree: StandoffTree
}

export interface CreateJsonEntryPartProps extends Omit<GetValueProps, 'annotation'> {
	id: ID
	partConfig?: PartConfig
	root?: AnnotationNode
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
					// tree: tree.exportReactTree(),
					standoff: tree.getStandoff(true),
					// standoffTree3: toStandoffTree2(tree),
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

			value = props.sourceTree.list
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
		partId: props.partConfig?.id,
		sourceId: props.sourceId,
		// standoffTree2: toStandoffTree2(props.sourceTree),
	}
}


// function convertNode(node: AnnotationNode): AnnotationNode2 | string {
// 	if (node.name === TEXT_NODE_NAME) return node.metadata._textContent
// 	return {
// 		id: node.id,
// 		parent: node.parent?.id,
// 		children: node.children.map(convertNode)
// 	}
// }

// function convertTree(root: AnnotationNode): AnnotationNode2 {
// 	const tree = convertNode(root)
// 	if (typeof tree === 'string') throw new Error('Root of tree cannot be a string')
// 	return tree
// }

// function toStandoffTree2(standoffTree: StandoffTree): StandoffTree2 {
// 	const tree = convertTree(standoffTree.root)

// 	return {
// 		annotations: standoffTree
// 			.getStandoff(true).annotations
// 			.map(x => toDocereAnnotation(x, standoffTree.options))
// 			.map<[string, DocereAnnotation]>(x => [x.props.key as string, x]),
// 		tree
// 	}
// }
