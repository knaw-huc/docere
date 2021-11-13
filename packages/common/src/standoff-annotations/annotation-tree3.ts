import { ExportOptions, extendExportOptions, HIGHLIGHT_NODE_NAME, PartialStandoff, PartialStandoffAnnotation } from '.'
import { TagShape } from './index'
import { isChild, isAfter } from './utils'

export class StandoffTree3 {
	public tree: AnnotationNode
	public lookup: AnnotationLookup
	public annotations: Annotation3[]
	public nodeLookup: Map<string, AnnotationNode> = new Map()
	private rangePairs: Map<string, string> = new Map()
	private ranges: Map<Annotation3, [number, number]> = new Map()

	constructor(public standoff: PartialStandoff, private options: ExportOptions = extendExportOptions({})) {
		/** 
		 * Convert {@link PartialStandoffAnnotation } to {@link Annotation3}
		 */
		this.annotations = standoff.annotations
			.reduce<Annotation3[]>((prev, curr) => {
				const annotation = toAnnotation3(curr)

				if (annotation.tagShape === TagShape.Range) {
					this.splitRangeAnnotation(annotation).forEach(a => prev.push(a))
				} else {
					prev.push(annotation)
				}
				return prev
			}, [])

		this.ensureRoot()

		/**
		 * Create a lookup of all the annotations by ID. The tree only contains
		 * the ID of the annotation. The lookup is used as a quick way to retrieve
		 * the full annotation
		 */
		this.lookup = this.annotations.reduce<AnnotationLookup>(
			(prev, curr) => prev.set(curr.id, curr),
			new Map()
		)

		this.update()
	}

	highlightSubString(subStrings: string[]) {
		if (subStrings == null) return

		/**
		 * Remove current highlight
		 */
		this.annotations = this.annotations.filter(a => {
			if (a.name === HIGHLIGHT_NODE_NAME) this.ranges.delete(a)
			return a.name !== HIGHLIGHT_NODE_NAME
		})

		/**
		 * Match all substrings in the standoff text and create an annotation
		 * per match
		 */
		for (const subString of subStrings) {
			const matches = this.standoff.text.matchAll(new RegExp(subString, 'g'))

			for (const match of matches) {
				this.addAnnotation({
					name: HIGHLIGHT_NODE_NAME,
					start: match.index,
					end: match.index + subString.length,
					tagShape: TagShape.Range
				}, false)
			}
		}

		this.update()
	}

	addAnnotation(partialAnnotation: PartialStandoffAnnotation, update = true) {
		const annotation = toAnnotation3(partialAnnotation)

		/**
		 * Range annotations have to be splitted into a start and end annotation,
		 * if it is a default or self closing annotation it is wrapped in an array
		 * to prevent code repetition
		 */ 
		const annotations = annotation.tagShape === TagShape.Range ?
			this.splitRangeAnnotation(annotation) :
			[annotation]

		/**
		 * Add the new annotations to the list and the lookup
		 */
		annotations.forEach(a => {
			this.annotations.push(a)
			this.lookup.set(a.id, a)
		})

		if (update) this.update()
	}

	/**
	 * Ensure the AnnotationTree has a root annotation. Without a
	 * root a tree can't be build.
	 * 
	 * TODO why is ensureRoot necessary for Republic data? Is there no root?
	 */
	private ensureRoot() {
		// Find the root
		const root = this.annotations.find(a =>
			a.start === 0 && a.end === this.standoff.text.length
		)

		// If there is no root, create one and add it to the annotation list
		if (root == null) {
			this.annotations.push(toAnnotation3({
				end: this.standoff.text.length,
				props: { isRoot: true },
				name: this.options.rootNodeName,
				start: 0,
			}))
		} else {
			root.props.isRoot = true
		}
	}

	private update() {

		/**
		 * Sort {@link Annotation3 | annotations} by {@link sortByOffset | offset}
		 */
		this.annotations.sort(sortByOffset(this.options))

		this.createTree()
	}

	private splitRangeAnnotation(annotation: Annotation3) {
		const startAnnotation = cloneAnnotation(annotation)
		startAnnotation.end = startAnnotation.start
		startAnnotation.props.isRangeStart = true

		const endAnnotation = cloneAnnotation(annotation)
		endAnnotation.start = endAnnotation.end
		endAnnotation.props.isRangeEnd = true

		this.rangePairs.set(startAnnotation.id, endAnnotation.id)
		this.ranges.set(startAnnotation, [startAnnotation.start, endAnnotation.start])

		return [startAnnotation, endAnnotation]
	}

	/**
	 * Create a {@link AnnotationNode | tree} out of standoff {@link Annotation3 | annotations}.
	 * 
	 * Returns a {@link AnnotationNode | tree} and a {@link AnnotationLookup | lookup}
	 */
	private createTree() {
		let prevNode: AnnotationNode
		this.nodeLookup = new Map()
		this.tree = null

		const findParent = (nodeId: string, parentId: string): AnnotationNode =>
			isChild(this.lookup.get(nodeId), this.lookup.get(parentId)) ?
				this.nodeLookup.get(parentId) :
				findParent(nodeId, this.nodeLookup.get(parentId).parent)

		for (const annotation of this.annotations) {
			const node: AnnotationNode = {
				id: annotation.id,
				parent: null,
				children: [],
			}

			this.nodeLookup.set(node.id, node)

			/**
			 * If tree is null, node must be the root!
			 */
			if (this.tree == null) {
				this.tree = node
			} else {
				const parent = findParent(node.id, prevNode.id)
				node.parent = parent.id
				parent.children.push(node)	
			}

			/**
			 * Only if the {@link TagShape | tag shape} is a default tag (<x>..</x>),
			 * it is assigned to prevNode. If the tag shape is self closing (<x/>)
			 * or a range (<x/>...<x/>), it cannot have children and we can skip
			 * checking against them.
			 */
			if (annotation.tagShape === TagShape.Default) {
				prevNode = node
			}
		}

		addTextNodes(this.tree, this.standoff.text, this.lookup, this.ranges)
	}

	// private *walker(
	// 	startAnnotation: AnnotationNode,
	// 	endAnnotation: AnnotationNode,
	// ) {
	// 	let currentAnnotation: Node = startAnnotation

	// 	while(true) {
	// 		if (currentAnnotation == null) {
	// 			currentAnnotation = this.tree
	// 		} else if (
	// 			typeof currentAnnotation === 'string' ||
	// 			isTextNode(currentAnnotation)
	// 		) {
	// 			return currentAnnotation
	// 		} else if (currentAnnotation.children.length) {
	// 			currentAnnotation = currentAnnotation.children[0]
	// 		} else {
	// 			let parent = this.nodeLookup.get(currentAnnotation.parent)
	// 			let index = parent.children.indexOf(currentAnnotation)
	// 			let nextSibling = parent.children[index + 1]

	// 			while (nextSibling == null && parent.parent != null) {
	// 				const parentsParent = this.nodeLookup.get(parent.parent)
	// 				index = parentsParent.children.indexOf(parent)
	// 				nextSibling = parentsParent.children[index + 1]
	// 				parent = parentsParent
	// 			}

	// 			currentAnnotation = nextSibling

	// 			if (currentAnnotation == null) return
	// 		} 

	// 		if (currentAnnotation === endAnnotation) return

	// 		yield currentAnnotation
	// 	}
	// }
}

interface AnnotationNode {
	id: string
	parent: string
	children: Node[]
}

interface TextNode {
	text: string
	rangeAnnotation?: Annotation3
}

export type Node = AnnotationNode | TextNode

export type AnnotationLookup = Map<string, Annotation3>

export type Annotation3 = Required<PartialStandoffAnnotation>

export function isTextNode(node: Node): node is TextNode {
	return node.hasOwnProperty('text')
}

function toAnnotation3(currAnnotation: PartialStandoffAnnotation): Annotation3 {
	if (currAnnotation.end == null) {
		currAnnotation.tagShape = TagShape.SelfClosing
	}

	if (
		currAnnotation.tagShape === TagShape.SelfClosing &&
		currAnnotation.end !== currAnnotation.start
	) currAnnotation.end = currAnnotation.start

	return {
		end: currAnnotation.start,
		endOrder: null,
		id: currAnnotation.id == null ? generateAnnotationId() : null,
		props: {},
		sourceProps: {},
		startOrder: null,
		tagShape: TagShape.Default,
		...currAnnotation,
	}
}

export function generateAnnotationId() {
	return Math.random().toString().slice(2)
}

export function cloneAnnotation<T extends PartialStandoffAnnotation>(
	annotation: T,
	generateNewID = true
): T {
	return {
		...annotation,
		id: generateNewID ? generateAnnotationId() : annotation.id,
		props: { ...annotation.props },
		sourceProps: { ...annotation.sourceProps },
	}
}

function addTextNodes(
	node: AnnotationNode,
	text: string,
	lookup: Map<string, Annotation3>,
	ranges: Map<Annotation3, [number, number]>
): AnnotationNode {
	const rootAnnotation = lookup.get(node.id)

	function addTextNode(startOffset: number, endOffset: number) {
		const node: TextNode = { text: text.slice(startOffset, endOffset) }

		for (const [annotation, [start, end]] of ranges.entries()) {
			if (startOffset >= start && endOffset <= end && node.text.trim().length > 0) {
				node.rangeAnnotation = annotation
			}
		}

		return node
	}

	node.children = node.children.reduce((prev, curr, index, array) => {
		// console.log('HERE ARE CHILRNJK', curr)
		if (typeof curr === 'string') return prev
		if (isTextNode(curr)) return prev

		const currAnnotation = lookup.get(curr.id)
		// compare first node with root start, to add text content to start
		if (index === 0 && rootAnnotation.start < currAnnotation.start) {
			// const annotation = createTextAnnotationNode(text, node.start, curr.start, node)
			prev.push(addTextNode(rootAnnotation.start, currAnnotation.start))
		}

		// compare curr anno with prev node, to add text content between
		const prevChild = array[index - 1]
		if (prevChild != null && typeof prevChild !== 'string' && !isTextNode(prevChild)) {
			const prevAnno = lookup.get(prevChild.id)
			if (prevAnno.end < currAnnotation.start) {
				// const annotation = createTextAnnotationNode(text, prevAnno.end, curr.start, node)
				prev.push(addTextNode(prevAnno.end, currAnnotation.start))
			}

		}

		// recursively add the curr annotation node
		prev.push(addTextNodes(curr, text, lookup, ranges))
		// console.log(text.slice(currAnnotation.start, currAnnotation.end))
		// prev.push(text.slice(currAnnotation.start, currAnnotation.end))

		// compare last node with root end, to add text content to the end
		if (index === array.length - 1 && rootAnnotation.end > currAnnotation.end) {
			// const annotation = createTextAnnotationNode(text, curr.end, node.end, node)
			prev.push(addTextNode(currAnnotation.end, rootAnnotation.end))
		}

		return prev
	}, [] as Node[])

	if (!node.children.length && rootAnnotation.start < rootAnnotation.end) {
		node.children = [addTextNode(rootAnnotation.start, rootAnnotation.end)]
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
		if (a.props.isRoot) return -1 
		if (b.props.isRoot) return 1

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
