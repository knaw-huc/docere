import { exportMetadata } from "./export-xml"
import { AnnotationNode, DocereAnnotation, ExportOptions, TEXT_NODE_NAME } from "."

const invalidKeys = new Set(['ref', 'key'])

export function exportReactTree(root: AnnotationNode, options: ExportOptions): DocereAnnotation {
	const { id, name, children, metadata } = root

	const annotationClone: DocereAnnotation = {
		type: name,
		props: {
			key: id
		}
	} 

	if (metadata.key != null) annotationClone.props._key = metadata.key

	if (children.length) {
		annotationClone.children = children
			.map(curr =>
				curr.name === TEXT_NODE_NAME ?
					curr.metadata._textContent :
					exportReactTree(curr, options)
			)
	}

	// If the annotation is an entity, only add the entity ID, because
	// the metadata can already be found in the lookup (entry.textData.entities)
	// if (metadata.hasOwnProperty('_entityId')) {
	// 	annotationClone.props._entityId = metadata._entityId
	// } else {
	// Use exportMetadata to exclude/include metadata according to the export options
	annotationClone.props = exportMetadata(root, options)
		// Don't use the annotation ID, because it is already 
		// used as the `key` metadata. React uses the `key` to
		// distingish elements in a list 
		.filter(([key]) => key !== 'id')
		
		// Rename keys that have a different purpose in React
		.map(([key, value]) =>
			invalidKeys.has(key) ?
				[`_${key}`, value] :
				[key, value]
		)

		// Add metadata to props
		.reduce<DocereAnnotation['props']>((prev, curr) => {
			const [key, value] = curr
			prev[key] = value
			return prev
		}, annotationClone.props)

	return annotationClone
}
