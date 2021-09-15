import { ExportOptions, HIGHLIGHT_NODE_NAME, PartialStandoff, PartialStandoffAnnotation } from '.'
import { EntityConfig } from '../entry'
import { FacsimileArea } from '../entry/facsimile'
import { TagShape } from '../enum'

export class StandoffTree3 {
	private annotations: Annotation3[]
	public tree: AnnotationNode
	public lookup: AnnotationLookup

	highlightSubString(subStrings: string[]) {
		for (const subString of subStrings) {
			const matches = this.standoff.text.matchAll(new RegExp(subString, 'g'))

			for (const match of matches) {
				this.addAnnotation({
					name: HIGHLIGHT_NODE_NAME,
					start: match.index,
					end: match.index + 6,
					tagShape: TagShape.Range
				}, false)
			}
		}

		this.update()
	}

	addAnnotation(partialAnnotation: PartialStandoffAnnotation, update = true) {
		const annotation = toAnnotation3(partialAnnotation)
		this.annotations.push(annotation)
		this.lookup.set(annotation.id, annotation)

		if (update) this.update()
	}

	constructor(public standoff: PartialStandoff, private options: ExportOptions) {

		/** 
		 * Convert {@link PartialStandoffAnnotation } to {@link Annotation3}
		 */
		this.annotations = standoff.annotations
			// TODO remove
			.filter(a => a.id !== 'NL-HaNA_1.01.02_3760_0008-line-3059-919-752-176')
			.map(toAnnotation3)

		this.lookup = this.annotations.reduce<AnnotationLookup>(
			(prev, curr) => prev.set(curr.id, curr),
			new Map()
		)

		this.update()
	}

	update() {
		const annotations = this.annotations.reduce<Annotation3[]>((prev, curr) => {
			if (curr.tagShape === TagShape.Range) {
				const startAnnotation = cloneAnnotation(curr)
				startAnnotation.end = startAnnotation.start
				startAnnotation.metadata.isRangeStart = true
				prev.push(startAnnotation)

				const endAnnotation = cloneAnnotation(curr)
				endAnnotation.start = endAnnotation.end
				endAnnotation.metadata.isRangeEnd = true
				prev.push(endAnnotation)
			} else {
				prev.push(curr)
			}
			return prev
		}, [])

		/**
		 * Sort {@link Annotation3 | annotations} by {@link sortByOffset | offset}
		 */
		annotations.sort(sortByOffset(this.options))

		/**
		 * Create a {@link AnnotationNode | tree} out of standoff {@link Annotation3 | annotations}.
		 * 
		 * Returns a {@link AnnotationNode | tree} and a {@link AnnotationLookup | lookup}
		 */
		this.tree = createTree3(annotations, this.standoff.text, this.lookup)
	}
}

interface AnnotationNode {
	id: string
	parent: string
	children: Node[]
}

type Node = string | AnnotationNode

type AnnotationLookup = Map<string, Annotation3>

export interface Annotation3 extends Required<PartialStandoffAnnotation> {
	metadata: {
		areas?: FacsimileArea[]
		entityConfig?: EntityConfig
		entityConfigId?: string
		entityId?: string
		isRoot?: boolean
		isRangeStart?: boolean
		isRangeEnd?: boolean
		facsimileId?: string
		facsimilePath?: string
		range?: Set<string>
		textContent?: string
	}
	sourceMetadata: Record<string, any>
}

function toAnnotation3(currAnnotation: PartialStandoffAnnotation): Annotation3 {
	if (currAnnotation.end == null) currAnnotation.tagShape = TagShape.SelfClosing

	if (
		currAnnotation.tagShape === TagShape.SelfClosing &&
		currAnnotation.end !== currAnnotation.start
	) currAnnotation.end = currAnnotation.start

	const { metadata, ...rest } = currAnnotation

	const tmp: Annotation3 = {
		end: currAnnotation.start,
		endOrder: null,
		id: currAnnotation.id == null ? Math.random().toString().slice(2) : null,
		metadata: {},
		sourceMetadata: metadata || {},
		startOrder: null,
		tagShape: TagShape.Default,
		...rest,
	}

	// TODO move to preprocessing
	Object.keys(tmp.sourceMetadata)
		.filter(key => key.charAt(0) === '_')
		.forEach(key => {
			// @ts-ignore
			tmp.metadata[key.slice(1)] = tmp.sourceMetadata[key]
			delete tmp.sourceMetadata[key]
		})
	
	return tmp
}

function cloneAnnotation(annotation: Annotation3): Annotation3 {
	return {
		...annotation,
		id: Math.random().toString().slice(2),
		metadata: { ...annotation.metadata },
		sourceMetadata: { ...annotation.sourceMetadata },
	}
}

function createTree3(
	annotations: Annotation3[],
	text: string,
	lookup: AnnotationLookup
): AnnotationNode {
	let tree: AnnotationNode
	let prevNode: AnnotationNode
	let nodeLookup: Map<string, AnnotationNode> = new Map()

	function findParent(nodeId: string, parentId: string): AnnotationNode {
		// console.log(
		// 	isChild(lookup.get(nodeId), lookup.get(parentId)),
		// 	`${lookup.get(nodeId).name}__${lookup.get(nodeId).start}__${lookup.get(nodeId).end}`,
		// 	`${lookup.get(parentId).name}__${lookup.get(parentId).start}__${lookup.get(parentId).end}`,
		// )
		return isChild(lookup.get(nodeId), lookup.get(parentId)) ?
			nodeLookup.get(parentId) :
			findParent(nodeId, nodeLookup.get(parentId).parent)
	}

	for (const annotation of annotations) {
		const node: AnnotationNode = {
			id: annotation.id,
			parent: null,
			children: [],
		}

		nodeLookup.set(node.id, node)

		if (tree == null) {
			tree = node
		} else {
			const parent = findParent(node.id, prevNode.id)
			node.parent = parent.id
			parent.children.push(node)	
		}

		/**
		 * Only if the {@link TagShape | tag shape} is a normal tag, we
		 * assign it to prevNode. If the tag shape is self closing or a
		 * range, it cannot have children and we can skip checking against
		 * them.
		 */
		if (annotation.tagShape === TagShape.Default) {
			console.log(node)
			prevNode = node
		}
	}

	return addTextNodes(tree, text, lookup)

	// function findParent(annotation: Annotation3, startIndex: number): Annotation3 {
	// 	let index = startIndex - 1
	// 	let parent = annotations[index]

	// 	while (parent != null && !isChild(annotation, parent)) {
	// 		parent = annotations[index--]
	// 	}

	// 	return parent
	// }

	// annotations
	// 	// .filter(x => x.name !== TEXT_NODE_NAME)
	// 	.forEach((annotation, index) => {
	// 		const parent = findParent(annotation, index)

	// 		// delete annotation.metadata._textContent
	// 		// annotation.parent = null
	// 		// annotation.children = []

	// 		if (parent == null) {
	// 			tree = {
	// 				children: [],
	// 				id: annotation.id,
	// 				parent: null,
	// 			}
	// 		} else {
	// 			// parent.children.push({
	// 			// 	children: [],
	// 			// 	id: annotation.id,
	// 			// 	parent: parent.id
	// 			// })
	// 			console.log('implement')
	// 		}
	// 	})

	// if (tree == null) return

	// return addTextNodeAnnotations(tree, text)
}

function addTextNodes(node: AnnotationNode, text: string, lookup: Map<string, Annotation3>): AnnotationNode {
	const rootAnnotation = lookup.get(node.id)

	node.children = node.children.reduce((prev, curr, index, array) => {
		if (typeof curr === 'string') return

		const currAnnotation = lookup.get(curr.id)
		// compare first node with root start, to add text content to start
		if (index === 0 && rootAnnotation.start < currAnnotation.start) {
			// const annotation = createTextAnnotationNode(text, node.start, curr.start, node)
			prev.push(text.slice(rootAnnotation.start, currAnnotation.start))
		}

		// compare curr anno with prev node, to add text content between
		const prevChild = array[index - 1]
		if (prevChild != null && typeof prevChild !== 'string') {
			const prevAnno = lookup.get(prevChild.id)
			if (prevAnno.end < currAnnotation.start) {
				// const annotation = createTextAnnotationNode(text, prevAnno.end, curr.start, node)
				prev.push(text.slice(prevAnno.end, currAnnotation.start))
			}

		}

		// recursively add the curr annotation node
		prev.push(addTextNodes(curr, text, lookup))

		// compare last node with root end, to add text content to the end
		if (index === array.length - 1 && rootAnnotation.end > currAnnotation.end) {
			// const annotation = createTextAnnotationNode(text, curr.end, node.end, node)
			prev.push(text.slice(currAnnotation.end, rootAnnotation.end))
		}

		return prev
	}, [] as Node[])

	if (!node.children.length && rootAnnotation.start < rootAnnotation.end) {
		node.children = [text.slice(rootAnnotation.start, rootAnnotation.end)]
	}

	return node
}

// function createTextAnnotationNode(
// 		text: string,
// 		start: number,
// 		end: number,
// 		parent: AnnotationNode
// 	): AnnotationNode {
// 	return {
// 		...extendStandoffAnnotation({
// 			end,
// 			metadata: {
// 				_textContent: text.slice(start, end),
// 			},
// 			name: TEXT_NODE_NAME,
// 			start,
// 		}),
// 		children: [],
// 		parent,
// 	}
// }

function sortByHierarchy(options: ExportOptions) {
	return function(a: Annotation3, b: Annotation3) {
		const indexA = options.annotationHierarchy.indexOf(a.name)
		const indexB = options.annotationHierarchy.indexOf(b.name)

		if (indexA === -1 || indexB === -1) return

		if (indexA > indexB) return 1
		if (indexA < indexB) return -1

		return
	}
}

/**
 * Sort annotations so they can be used as a tree   
 * 
 * @param options
 * @returns 
 */
function sortByOffset(options: ExportOptions) {
	const sbh = sortByHierarchy(options)

	return function (a: Annotation3, b: Annotation3) {
		if (a.metadata.isRoot) return 0
		if (b.metadata.isRoot) return 1

		/**
		 * If start and end offset are equal, sort on annotation hierarchy.
		 * If a or b is not mentioned in the annotation hierachy, keep the
		 * original order.
		 */
		if (
			(a.start === b.start && a.end === b.end) ||
			(a.tagShape === TagShape.SelfClosing && a.start === b.start) ||
			(b.tagShape === TagShape.SelfClosing && a.start === b.start)
		) {
			const result = sbh(a, b)
			if (result != null) return result
		}

		if (isAfter(a, b)) return 1
		if (isAfter(b, a)) return -1

		if (isChild(a, b)) return 1
		if (isChild(b, a)) return -1

		return 0
	}
}

/** Check if annotation1 comes after annotation2 */
function isAfter(tag1: Annotation3, tag2: Annotation3): boolean {
	return tag1.start >= tag2.end
}

function isChild(child: Annotation3, parent: Annotation3): boolean {
	if (parent == null || child == null || parent === child) return false
	if (parent.tagShape === TagShape.SelfClosing) return false
	if (child.tagShape === TagShape.SelfClosing) {
		return parent.start <= child.start && parent.end >= child.start
	}
	return parent.start <= child.start && parent.end >= child.end
}
