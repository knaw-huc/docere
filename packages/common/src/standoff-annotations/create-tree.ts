import { AnnotationNode } from "."
import { extendStandoffAnnotation, isChild } from "./utils"

const TEXT_NODE_NAME = "__TMP__"

/**
 * Create a tree (AnnotationNode) from StandoffTree
 * 
 * The whole text of StandoffTree.standoff.text will be covered by annotations.
 * If there is a gap between annotations, an text annotation will be added.
 */
export function createTree(
	annotations: AnnotationNode[],
	text: string
): AnnotationNode {
	let tree: AnnotationNode

	function findParent(annotation: AnnotationNode, startIndex: number): AnnotationNode {
		let index = startIndex - 1
		let parent = annotations[index]

		while (parent != null && !isChild(annotation, parent)) {
			parent = annotations[index--]
		}

		return parent
	}

	annotations
		.filter(x => x.name !== TEXT_NODE_NAME)
		.forEach((annotation, index) => {
			const parent = findParent(annotation, index)

			delete annotation.metadata._textContent
			annotation.parent = null
			annotation.children = []

			if (parent == null) {
				tree = annotation
			} else {
				annotation.parent = parent
				parent.children.push(annotation)
			}
		})

	if (tree == null) return

	return addTextNodeAnnotations(tree, text)
}

function addTextNodeAnnotations(root: AnnotationNode, text: string): AnnotationNode {
	root.children = root.children.reduce((prev, curr, index, array) => {
		// compare first node with root start, to add text content to start
		if (index === 0 && root.start < curr.start) {
			const annotation = createTextAnnotationNode(text, root.start, curr.start, root)
			prev.push(annotation)
		}

		// compare curr anno with prev node, to add text content between
		const prevAnno = array[index - 1]
		if (prevAnno != null && typeof prevAnno !== 'string' && prevAnno.end < curr.start) {
			const annotation = createTextAnnotationNode(text, prevAnno.end, curr.start, root)
			prev.push(annotation)
		}

		// recursively add the curr annotation node
		prev.push(addTextNodeAnnotations(curr, text))

		// compare last node with root end, to add text content to the end
		if (index === array.length - 1 && root.end > curr.end) {
			const annotation = createTextAnnotationNode(text, curr.end, root.end, root)
			prev.push(annotation)
		}

		return prev
	}, [] as AnnotationNode[])

	if (!root.children.length && root.start < root.end) {
		root.metadata._textContent = text.slice(root.start, root.end)
	}

	return root
}

function createTextAnnotationNode(
		text: string,
		start: number,
		end: number,
		parent: AnnotationNode
	): AnnotationNode {
	return {
		...extendStandoffAnnotation({
			end,
			metadata: {
				_textContent: text.slice(start, end),
			},
			name: TEXT_NODE_NAME,
			start,
		}),
		children: [],
		parent,
	}
}
