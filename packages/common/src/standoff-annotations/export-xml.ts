import { AnnotationNode, ROOT_NODE_NAME, PartialStandoffAnnotation } from "."
import { TagShape } from "../enum"
import { ExportOptions } from "./export-options"

const TEXT_NODE_NAME = '__TMP__'

export function exportMetadata(annotation: PartialStandoffAnnotation, options: ExportOptions) {
	let metadata: [string, any][] = Object.keys(annotation.metadata)
		// .filter(key => key.charAt(0) !== '_')
		.map(key => [key, annotation.metadata[key]])

	metadata = metadata.filter(([key]) => options.metadata.exclude.indexOf(key) === -1)

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
	if (root.name === TEXT_NODE_NAME) return getTextNode(root) 

	let tagString = `<${root.name}${metadata2string(root, options)}`

	if (root.tagShape === TagShape.SelfClosing) return `${tagString}/>`

	const meta = (options.metadata.addRootMetadata && root.name === ROOT_NODE_NAME) ?
		Object.keys(root.metadata).reduce((prev, curr) =>
			`${prev}<meta key="${curr}" value="${root.metadata[curr]?.toString()}"/>`,
			''
		) :
		''

	const body = root.children.length === 0 ?
		getTextNode(root) :
		root.children.map(child => exportXml(child, options)).join('')

	return `${tagString}>${meta}${body}</${root.name}>`
}

export function getTextNode(node: AnnotationNode) {
	const { _textContent } = node.metadata
	return _textContent != null ? _textContent.replace(/&/g, '&amp;') : ''
}
