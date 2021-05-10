import { AnnotationNode, TEXT_NODE_NAME, ROOT_NODE_NAME, PartialStandoffAnnotation } from "."
import { ExportOptions } from "."

export function exportMetadata(annotation: PartialStandoffAnnotation, options: ExportOptions) {
	let metadata: [string, any][] = Object.keys(annotation.metadata)
		.map(key => {
			const value = (key === '_textContent') ?
				annotation.metadata._textContent.replace(/&/g, '&amp;') :
				annotation.metadata[key]

			return [key, value]
		})

	// if (annotation.range.size) {
	// 	metadata.push(['_range_ids', Array.from(annotation.range)])
	// }

	if (Array.isArray(options.metadata.exclude)) {
		metadata = metadata.filter(([key]) => options.metadata.exclude.indexOf(key) === -1)
	}

	if (Array.isArray(options.metadata.include)) {
		metadata = metadata.filter(([key]) => options.metadata.include.indexOf(key) > -1)
	}

	if (options.metadata.addId) {
		if (metadata.find(([key]) => key === 'id') == null) {
			metadata.push(['id', annotation.metadata.id || annotation.id])
		}
	}

	if (options.metadata.addOffsets) {
		metadata.push(['_start', annotation.start])
		metadata.push(['_end', annotation.end])
	}

	return metadata
}

function metadata2string(annotation: AnnotationNode, options: ExportOptions): string {
	if (annotation == null) return ''

	const metadata = exportMetadata(annotation, options)
		.map(([key, value]) => {
			if (key === '_range_ids') value = value?.join(' ')
			else value = value?.toString()
			return [key, value]
		})

	if (!metadata.length) return ''

	return ` ${metadata.map(([key, value]) => `${key}="${value}"`).join(' ')}`
}

export function exportXml(root: AnnotationNode, options: ExportOptions): string {
	if (root.name === TEXT_NODE_NAME) {
		const text = root.metadata._textContent.replace(/&/g, '&amp;')
		// return (
		// 	root.range.size &&
		// 	root.parent.children.length !== 1
		// ) ?
		// `<${RANGE_TAG_NAME}${metadata2string(root, options)}>${text}</${RANGE_TAG_NAME}>` :
		return text
	}

	let tagString = `<${root.name}${metadata2string(root, options)}`

	if (root.isSelfClosing) return `${tagString}/>`

	const meta = (root.name === ROOT_NODE_NAME) ?
		Object.keys(root.metadata).reduce((prev, curr) =>
			`${prev}<meta key="${curr}" value="${root.metadata[curr]?.toString()}"/>`,
			''
		) :
		''

	return `${tagString}>${meta}${root.children.map(child => exportXml(child, options)).join('')}</${root.name}>`
}
