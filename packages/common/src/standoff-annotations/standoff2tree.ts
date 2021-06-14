import { PartialStandoffAnnotation, AnnotationNode, TEXT_NODE_NAME, StandoffAnnotation, StandoffTree } from "."
import { ExportOptions } from "."
import { extendStandoffAnnotation, createAnnotationNode, isChild } from "./utils"


export function standoff2tree(annotationTree: StandoffTree, text: string, _options: ExportOptions): AnnotationNode {
	let tree: AnnotationNode
	const annotationNodeLookup: Record<string, AnnotationNode> = {}

	function findParent(annotation: StandoffAnnotation, startIndex: number): StandoffAnnotation {
		let index = startIndex - 1
		let parent = annotationTree.atIndex(index)

		while (parent != null && !isChild(annotation, parent)) {
			parent = annotationTree.atIndex(index--)
		}

		return parent
	}

	// setOrder(standoff.annotations, options.annotationHierarchy)

	annotationTree.annotations.forEach((annotation, index) => {
		const parent = findParent(annotation, index)

		const annotationNode = createAnnotationNode(annotation)
		annotationNodeLookup[annotationNode.id] = annotationNode

		if (parent == null) {
			tree = annotationNode
		} else {
			annotationNodeLookup[parent.id]
				.children.push(annotationNode)
		}
	})

	if (tree == null) return
	return addTextNodes(tree, text)
}

function addText(agg: AnnotationNode[], text: string, start: number, end: number) {
	agg.push(createAnnotationNode(extendStandoffAnnotation({
		end,
		metadata: {
			_textContent: text.slice(start, end),
		},
		name: TEXT_NODE_NAME,
		start,
	})))
}

function addTextNodes(root: AnnotationNode, text: string): AnnotationNode {
	root.children = root.children.reduce((prev, curr, index, array) => {
		// compare first anno with root start, to add text content to start
		if (index === 0 && root.start < curr.start) addText(prev, text, root.start, curr.start)

		// compare curr anno with prev anno, to add text content between
		const prevAnno = array[index - 1]
		if (prevAnno != null && typeof prevAnno !== 'string' && prevAnno.end < curr.start) {
			addText(prev, text, prevAnno.end, curr.start)
		}
		prev.push(addTextNodes(curr, text))

		// compare last anno with root end, to add text content to the end
		if (index === array.length - 1 && root.end > curr.end) addText(prev, text, curr.end, root.end)

		return prev
	}, [] as AnnotationNode[])

	if (!root.children.length && root.start < root.end) addText(root.children, text, root.start, root.end)

	return root
}

// @ts-ignore
function setOrder(annotations: PartialStandoffAnnotation[], annotationHierarchy: string[] = []) {
	if (!annotationHierarchy.length) return

	const orderPerOffset = annotations.reduce((prev, curr) => {
		if (prev.has(curr.start)) {
			prev.set(curr.start, prev.get(curr.start).concat(curr))
		} else {
			prev.set(curr.start, [curr])
		}

		if (prev.has(curr.end)) {
			prev.set(curr.end, prev.get(curr.end).concat(curr))
		} else {
			prev.set(curr.end, [curr])
		}
		return prev
	}, new Map<number, PartialStandoffAnnotation[]>())

	for (const [offset, annotations] of Array.from(orderPerOffset.entries())) {
		if (annotations.length < 2) continue
		annotations.sort((a, b) => {
			// Sort on opening/closing tag. Closing tags
			// first, opening tags second
			const aOpening = a.start === offset
			const bOpening = b.start === offset
			if (aOpening && !bOpening) return 1
			if (!aOpening && bOpening) return -1

			const tagOrderA = annotationHierarchy.indexOf(a.name)
			const tagOrderB = annotationHierarchy.indexOf(b.name)
			if (tagOrderA === -1 || tagOrderB === -1) return 0

			// If a and b are opening, follow the tag order
			if (aOpening) {
				if (tagOrderA > tagOrderB) return 1
				if (tagOrderA < tagOrderB) return -1
			
			// If a and b are closing, follow the reversed tag order
			} else {
				if (tagOrderA > tagOrderB) return -1
				if (tagOrderA < tagOrderB) return 1
			}

			return 0
		})

		annotations.forEach((a, index) => {
			(a.start === offset) ?
				a.startOrder = index :
				a.endOrder = index
		})
	}
}
