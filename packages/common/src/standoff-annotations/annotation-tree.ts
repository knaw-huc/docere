import { TextLayerConfig } from '../entry/layer'
import { isAnnotation, isChild, sortByOffset, toAnnotationNode } from './utils'
import { createTree } from './create-tree'
import { exportXml } from './export-xml'
import { exportReactTree } from './export-react-tree'
import { Ranges } from './ranges'
// import { OverlapController } from './overlap-controller'

import { StandoffAnnotation, FilterFunction, PartialStandoffAnnotation, AnnotationNode, PartialStandoff, TEXT_NODE_NAME, Standoff } from '.'
import { ExportOptions, extendExportOptions, PartialExportOptions } from './export-options'

type Lookup = Map<string, AnnotationNode>

/**
 * Turns {@link Standoff} into a tree in order to use the standoff as an
 * XML document or React component tree.
 * 
 * Keep in mind this class does not really represent a tree, the tree is only
 * created upon {@link StandoffTree.exportXml} or {@link StandoffTree.exportReactTree}.
 * 
 * @extends StandoffWrapper
 * 
 * @todo TODO rename to AnnotationTree
 */
export class StandoffTree {
	private lookup: Lookup
	private ranges = new Ranges()
	metadata: Standoff['metadata']
	text: string
	options: ExportOptions
	root: AnnotationNode
	list: AnnotationNode[]

	constructor(
		standoff: PartialStandoff,
		options: PartialExportOptions = {},
	) {
		this.options = extendExportOptions(options)

		this.metadata = standoff.metadata
		this.text = standoff.text

		this.list = standoff.annotations.map(toAnnotationNode)
		this.ensureRoot()

		this.update()
	}

	getStandoff() {
		return {
			metadata: this.metadata,
			text: this.text,
			annotations: this.list
		}
	}

	/**
	 * When the StandoffTree is altered, the annotations have to be updated:
	 * add an index, create a lookup and sort the annotations 
	 */
	private update() {
		this.list.sort(sortByOffset(this.options))

		this.list.forEach((a, i) => { a.index = i })

		this.lookup = this.list
			.reduce<Lookup>((prev, curr) => {
				prev.set(curr.id, curr)
				return prev
			}, new Map())

		this.root = createTree(this.list, this.text)
		this.addRangesToTree()
	}

	private addRangesToTree() {
		for (const [id, startNode, endNode] of this.ranges.all()) {
			for (const node of this.walker(startNode, endNode)) {
				if (this.isChild(endNode, node)) continue
				if (node.metadata._range == null) {
					node.metadata._range = new Set([id])
				} else {
					node.metadata._range.add(id)
				}
			}
		}
	}

	private isChild(childNode: AnnotationNode, parentNode: AnnotationNode) {
		let parent = childNode.parent
		while (parent != null && parent !== parentNode) {
			parent = parent.parent
		}
		return parent != null
	}

	/**
	 * Add one or more partial standoff annotations to the tree
	 * 
	 * @param annotations
	 * @param update 
	 */
	add(annotations: PartialStandoffAnnotation, update?: boolean): AnnotationNode
	add(annotations: PartialStandoffAnnotation[], update?: boolean): AnnotationNode[]
	add(
		annotations: PartialStandoffAnnotation | PartialStandoffAnnotation[],
		update = true
	): AnnotationNode | AnnotationNode[] {
		if (annotations == null) return null

		if (!Array.isArray(annotations)) annotations = [annotations]

		const extendedAnnotations = annotations.map(toAnnotationNode)
		extendedAnnotations.forEach(a => this.list.push(a))

		if (update) this.update()

		return extendedAnnotations.length === 1 ? extendedAnnotations[0] : extendedAnnotations
	}

	remove(predicate: FilterFunction, update?: boolean): void
	remove(id: string, update?: boolean): void
	remove(annotation: StandoffAnnotation, update?: boolean): void
	remove(
		annotation: StandoffAnnotation | FilterFunction | string,
		update = true
	) {
		if (typeof annotation === 'string') annotation = this.byId(annotation)

		if (isAnnotation(annotation)) {
			this.list.splice(annotation.index, 1)
		} else {
			const predicate = annotation // without this declaration, typescript fails
			this.list = this.list.filter(a => !predicate(a))
		}

		if (update) this.update()
	}

	split(id: string, offset: number, update?: boolean): void
	split(annotation: StandoffAnnotation, offset: number, update?: boolean): void
	split(
		annotation: StandoffAnnotation | string,
		offset: number,
		update = true
	) {
		if (typeof annotation === 'string') annotation = this.byId(annotation)

		if (annotation === this.root) throw new Error("[StandoffTree] Can't split the root")

		if (
			annotation == null ||
			offset == null ||
			offset <= annotation.start ||
			offset >= annotation.end
		) return

		this.add(
			{
				metadata: {
					...annotation.metadata
				},
				end: annotation.end,
				start: offset,
				name: annotation.name,
			},
			false
		)

		annotation.end = offset

		if (update) this.update()
	}

	convertToMilestone(node: AnnotationNode, update?: boolean): void
	convertToMilestone(node: string, update?: boolean): void
	convertToMilestone(node: FilterFunction, update?: boolean): void
	convertToMilestone(
		node: FilterFunction | AnnotationNode | string,
		update = true
	) {
		if (node == null) return

		if (typeof node === 'string') node = this.byId(node)

		if (isAnnotation(node)) {
			this._convertToMilestone(node)
		} else {
			this.filter(node)
				.forEach(this._convertToMilestone)
		}

		if (update) this.update()
	}

	private _convertToMilestone(node: AnnotationNode) {
		node.end = node.start
		node.isSelfClosing = true
	}

	addRange(
		start: AnnotationNode | FilterFunction,
		end: AnnotationNode | ((a: AnnotationNode) => FilterFunction),
		getId?: (a: AnnotationNode, b: AnnotationNode) => string[],
		update = true
	) {
		if (start == null || end == null) return

		if (isAnnotation(start) && isAnnotation(end)) {
			const ids = getId == null ? [start.id] : getId(start, end)
			this.ranges.add(ids, start, end)
		} else if (!isAnnotation(start) && !isAnnotation(end)) {
			this.list
				.filter(start)
				.forEach(startNode => {
					const endNode = this.find(end(startNode))
					if (endNode != null) {
						const ids = getId == null ? [startNode.metadata.id] : getId(startNode, endNode)
						this.ranges.add(ids, startNode, endNode)
					}
				})
		}

		if (update) this.update()
	}

	removeRange(rangeId: string) {
		this.ranges.remove(rangeId)
	}

	/**
	 * Create a new {@link StandoffTree} from a {@link StandoffAnnotation}. 
	 * 
	 * The new StandoffTree will only contain the plain text of the new root.
	 * The root and the children will be shifted -x, where x is the root's old
	 * start offset.
	 * 
	 * @param node 
	 * @returns 
	 */
	createStandoffTreeFromAnnotation(node: AnnotationNode | TextLayerConfig['findRoot']) {
		if (node == null) throw new Error('[createStandoffTreeFromAnnotation] findRoot cannot be undefined')

		const root = (isAnnotation(node)) ? 
			node :
			this.list.find(node)

		if (root == null) throw new Error('[createStandoffTreeFromAnnotation] root cannot be undefined')

		// Get the text first, because the root's offsets are to be shifted
		const text = this.getTextContent(root)

		// Shift the annotations offsets to root's start
		const offset = root.start
		const annotations = [root].concat(this.getChildren(root))
			.map(a => {
				// TODO replace by "cloneAnnotation"?
				return {
					...a,
					start: a.start - offset,
					end: a.end - offset,
				}
			})

		// Create a new StandoffTree with the shifted annotations and text
		return new StandoffTree(
			{
				annotations,
				metadata: root.metadata,
				text, 
			},
			this.options
		)
	}

	/**
	 * Returns the parents an annotation.
	 * 
	 * The first parent is the direct parent all the way to the root.
	 * The parents may be filtered by a predicate.
	 */
	getParents(
		startAnnotation: AnnotationNode,
		predicate?: FilterFunction
	) {
		const parents = []
		while (startAnnotation.parent != null) {
			parents.push(startAnnotation.parent)
			startAnnotation = startAnnotation.parent
		}

		return predicate != null ? parents.filter(predicate) : parents
	}

	/**
	 * Returns the parents an annotation.
	 * 
	 * The first parent is the direct parent all the way to the root.
	 * The parents may be filtered by a predicate.
	 */
	findParent(
		node: AnnotationNode,
		predicate: FilterFunction
	) {
		let parent: AnnotationNode

		while (parent == null && node.parent != null) {
			node = node.parent
			if (predicate(node)) parent = node
		}

		return parent
	}

	findBefore(
		startAnnotation: AnnotationNode,
		predicate: FilterFunction
	) {
		let found: AnnotationNode = null
		let i = startAnnotation.index - 1
		let curr: AnnotationNode
		while (found == null && i >= 0) {
			curr = this.atIndex(i)
 			if (predicate(curr) && curr.end <= startAnnotation.start) found = curr
			i--
		}
		return found
	}

	findAfter(
		startAnnotation: AnnotationNode,
		predicate: FilterFunction
	) {
		const { length } = this.list

		let found: AnnotationNode = null
		let i = startAnnotation.index + 1
		let curr: AnnotationNode

		while (found == null && i < length) {
			curr = this.atIndex(i)
 			if (predicate(curr) && startAnnotation.end <= curr.start) found = curr
			i++
		}

		return found
	}

	// TODO move exportXml method to seperate class or function
	exportXml() {
		return exportXml(this.root, this.options)
	}

	exportReactTree() {
		return exportReactTree(this.root, this.options)
	}

	/**
	 * Get the text content of an annotation
	 * 
	 * The text content corresponds to a substring of this.standoff.text
	 * starting at offset annotation.start and ending at annotation.end.
	 * 
	 * If undefined is passed, the whole text is returned, because it is 
	 * like asking the text content of the whole list:
	 * AnnotationList.getTextContent(). When null is passed,
	 * it is interpreted as asking for the text content of an annotation
	 * which wasn't found: AnnotationList.getTextContent(null).
	 * 
	 * @param annotation 
	 * @returns 
	 */
	getTextContent(annotation?: AnnotationNode) {
		if (annotation === undefined) return this.text
		if (annotation == null) return null
		if (annotation.isSelfClosing) return ''
		return this.text.slice(annotation.start, annotation.end)
	}

	atIndex(index: number) {
		return this.list[index]
	}

	byId(id: string) {
		return this.lookup.get(id)
	}

	find(predicate: FilterFunction) {
		return this.list.find(predicate)
	}

	filter(predicate: FilterFunction) {
		return this.list.filter(predicate)
	}
 
	*walker(startAnnotation?: AnnotationNode, endAnnotation?: AnnotationNode) {
		let currentAnnotation: AnnotationNode = startAnnotation

		while(true) {
			if (currentAnnotation == null) {
				currentAnnotation = this.root
			} else if (currentAnnotation.children.length) {
				currentAnnotation = currentAnnotation.children[0]
			} else {
				let parent = currentAnnotation.parent
				let index = parent.children.indexOf(currentAnnotation)
				let nextSibling = parent.children[index + 1]

				while (nextSibling == null && parent.parent != null) {
					index = parent.parent.children.indexOf(parent)
					nextSibling = parent.parent.children[index + 1]
					parent = parent.parent
				}

				currentAnnotation = nextSibling

				if (currentAnnotation == null) return
			} 

			if (currentAnnotation === endAnnotation) return

			yield currentAnnotation
		}
	}

	/**
	 * Get next sibling annotation, skipping text content.
	 */
	getNextSibling(a: AnnotationNode) {
		const children = a.parent.children.filter(child => child.name !== TEXT_NODE_NAME)
		const index = children.indexOf(a)
		return children[index + 1]
	}

	/**
	 * Get previous sibling annotation, skipping text content.
	 */
	getPreviousSibling(a: AnnotationNode) {
		const children = a.parent.children.filter(child => child.name !== TEXT_NODE_NAME)
		const index = children.indexOf(a)
		return children[index - 1]
	}
	
	/**
	 * Get all annotations between two offsets. Annotations partly overlapping are
	 * not returned.
	 * 
	 * @param start number
	 * @param end number
	 * @returns T[]
	 */
	getChildrenFromOffsets(start: number, end: number) {
		return this.filter(child => start <= child.start && end >= child.end)
	}

	/**
	 * Get all children of an annotation. Not only the direct children are
	 * returned, but also the deeply nested children
	 */
	getChildren(parent: FilterFunction | AnnotationNode, filter?: FilterFunction): AnnotationNode[] {
		if (!isAnnotation(parent)) {
			parent = this.find(parent)
		}

		const children = parent.children
			.reduce((prev, curr) => {
				prev.push(curr)
				return prev.concat(this.getChildren(curr, filter))
			}, [])

		return filter != null ? children.filter(filter) : children
	}

	findChild(parentFilter: FilterFunction, childFilter: FilterFunction) {
		const parent = this.find(parentFilter)
		if (parent == null) return null
		return this.find(a =>
			childFilter(a) && isChild(a, parent)
		) || null
	}

	/**
	 * Ensure the AnnotationTree has a root annotation. Without a
	 * root a tree can't be build.
	 * 
	 * If no root is found, create one and transfer the standoff metadata
	 * to the new root.
	 * 
	 * @param metadata
	 */
	private ensureRoot() {
		// Find the root
		let root = this.list.find(a =>
			a.start === 0 && a.end === this.text.length
		)

		// If there is no root, create one and add it to the 
		// beginning of the annotation list
		if (root == null) {
			root = toAnnotationNode({
				end: this.text.length,
				metadata: this.metadata,
				name: this.options.rootNodeName,
				start: 0,
			})

			this.list.unshift(root)
		}

		root.metadata._isRoot = true
	}
}

	// private updateOffsets(annotation: StandoffAnnotation, start: number, end?: number, update = true) {
	// 	if (start != null) annotation.start = start
	// 	if (end != null) annotation.end = end
	// 	if (update) this.update()
	// }

	// private prettyList() {
	// 	console.log(this.list.map(({ name, metadata }) => ({ name, metadata })))
	// }


	/**
	 * Update this.list from this.tree. When a new tree is created,
	 * annotation nodes are cloned and the reference gets lost, so
	 * after creating the tree, the list has to be re-populated.
	 * 
	 * TODO if nodes were mutable, this function would not be necessary
	 */
	// private annotationsFromTree() {
	// 	this.list = []

	// 	const addChild = (a: AnnotationNode) => {
	// 		this.list.push(a)
	// 		a.children.forEach(addChild)
	// 	}

	// 	addChild(this.tree)
	// }

	
	/**
	 * 
	 * @param startFilter 
	 * @param endFilter 
	 * @param getIds 
	 */
	// addRanges(
	// 	startFilter: FilterFunction<StandoffAnnotation>,
	// 	endFilter: (startAnnotation: StandoffAnnotation) => FilterFunction<StandoffAnnotation>,
	// 	getIds: (startAnnotation: StandoffAnnotation, endAnnotation: StandoffAnnotation) => string[]
	// ) {
	// 	// Get all ranges. A range exists of a start milestone, and end 
	// 	// milestone and the IDs of the range. A start and end milestone,
	// 	// can have multiple range IDs.
	// 	const ranges =  this.filter(startFilter)
	// 		.reduce<[StandoffAnnotation, StandoffAnnotation, string[]][]>((prev, startAnnotation) => {
	// 			// Find the end annotation
	// 			const endAnnotation = this.find(endFilter(startAnnotation))
	// 			if (endAnnotation == null) {
	// 				console.error('[ERROR] Range has no end!', startAnnotation)
	// 				return prev
	// 			}

	// 			// Add start, end and range IDs to aggregate
	// 			prev.push([
	// 				startAnnotation,
	// 				endAnnotation,
	// 				getIds(startAnnotation, endAnnotation)
	// 			])

	// 			return prev
	// 		}, [])

	// 	// Add the range IDs to the child annotations
	// 	ranges.forEach(([start, end, ids]) => {
	// 		const annos = this.getChildrenFromOffsets(start.start, end.end)

	// 		const gaps = getGaps([start, ...annos, end])
	// 		const partialTextNodeAnnotations = gaps
	// 			.map(([start, end]) => ({
	// 				name: TEXT_NODE_NAME,
	// 				start,
	// 				end
	// 			}))
	// 		const textNodeAnnotations = this.add(partialTextNodeAnnotations, false)

	// 		annos.concat(textNodeAnnotations)
	// 			.forEach(a => ids.forEach(id => {
	// 				if (a.metadata._range == null) a.metadata._range = new Set()
	// 				a.metadata._range.add(id)
	// 			}))


	// 		this.update()
	// 	})
	// }
