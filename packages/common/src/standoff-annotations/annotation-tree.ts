import { createRoot, extendExportOptions, extendStandoffAnnotation, isAnnotation, isChild, sortByOffset } from './utils'
import { StandoffWrapper } from './annotation-list'
import { standoff2tree } from './standoff2tree'
import { exportXml } from './export-xml'
import { exportReactTree } from './export-react-tree'
import { OverlapController } from './overlap-controller'

import type { LintReport, PartialExportOptions, Standoff, StandoffAnnotation, ExportOptions, PartialStandoff, FilterFunction } from '.'

// @ts-ignore
import { simpleAnno } from './utils'
import { TextLayerConfig } from '../entry/layer'

function extendStandoff(standoff: PartialStandoff): Standoff {
	return {
		...standoff,
		annotations: standoff.annotations.map<StandoffAnnotation>(extendStandoffAnnotation),
	}
}

/**
 * Turns {@link Standoff} into a tree in order to use the standoff as an
 * XML document or React component tree.
 * 
 * Keep in mind this class does not really represent a tree, the tree is only
 * created upon {@link StandoffTree.exportXml} or {@link StandoffTree.exportReactTree}.
 * 
 * @extends StandoffWrapper
 * 
 * @todo 
 */
export class StandoffTree extends StandoffWrapper<StandoffAnnotation> {
	private overlapController: OverlapController
	private lookup: Map<string, StandoffAnnotation>
	options: ExportOptions
	root: StandoffAnnotation

	get annotations() {
		return this.standoff.annotations
	}

	constructor(
		standoff: PartialStandoff,
		options: PartialExportOptions = {},
		update = true
	) {
		super(extendStandoff(standoff))
		this.options = extendExportOptions(options)
		this.overlapController = new OverlapController(this)
		this.root = this.getRoot()

		// A StandoffTree has to have a root annotation
		if (this.root == null) {
			this.root = createRoot(this.standoff, this.options)

			// Add the new root to the annotations. Update the annotations only
			// if it will not be updated in the next step (when update === true)
			this.add(this.root, !update)

			// Add the root node name to the annotation hierarchy
			this.options.annotationHierarchy = [this.options.rootNodeName]
				.concat(this.options.annotationHierarchy)
		}

		if (update) this.update()
	}

	add(annotation: StandoffAnnotation, update = true) {
		const next = extendStandoffAnnotation(annotation)
		super.add(next)
		if (update) this.update()
	}

	updateOffsets(annotation: StandoffAnnotation, start: number, end?: number, update = true) {
		super.updateOffsets(annotation, start, end)
		if (update) this.update()
	}

	convertToMilestone(
		predicate: FilterFunction<StandoffAnnotation>,
		transferTextContent = false,
		update = true
	) {
		super.convertToMilestone(predicate, transferTextContent)
		if (update) this.update()
	}

	split(annotation: StandoffAnnotation, offset: number, update = true) {
		super.split(annotation, offset)
		if (update) this.update()
	}

	remove(predicate: FilterFunction<StandoffAnnotation>, update?: boolean): void
	remove(id: string, update?: boolean): void
	remove(annotation: StandoffAnnotation, update?: boolean): void
	remove(annotation: StandoffAnnotation | FilterFunction<StandoffAnnotation> | string, update = true): void {
		if (typeof annotation === 'string') {
			annotation = this.byId(annotation)
		}

		if (isAnnotation(annotation)) {
			this.standoff.annotations.splice(annotation.index, 1)
		} else {
			const predicate = annotation // without this declaration, typescript fails
			this.standoff.annotations = this.standoff.annotations.filter(a => !predicate(a))
		}

		if (update) this.update()
	}

	/**
	 * Create a new {@link StandoffTree} from a {@link StandoffAnnotation}. 
	 * 
	 * The new StandoffTree will only contain the plain text of the new root.
	 * The root and the children will be shifted -x, where x is the root's old
	 * start offset.
	 * 
	 * @param findRoot 
	 * @returns 
	 */
	createStandoffTreeFromAnnotation(findRoot: StandoffAnnotation): StandoffTree 
	createStandoffTreeFromAnnotation(findRoot: TextLayerConfig['findRoot']): StandoffTree 
	createStandoffTreeFromAnnotation(findRoot: StandoffAnnotation | TextLayerConfig['findRoot']): StandoffTree {
		if (findRoot == null) throw new Error('[createStandoffTreeFromAnnotation] findRoot cannot be undefined')

		const root = (isAnnotation(findRoot)) ? 
			findRoot :
			this.standoff.annotations.find(findRoot)

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

	findParent(
		predicate: FilterFunction<StandoffAnnotation>,
		startAnnotation: StandoffAnnotation
	) {
		return this.annotations.find(a =>
			predicate(a) && isChild(startAnnotation, a)
		)
	}

	findBefore(
		predicate: FilterFunction<StandoffAnnotation>,
		startAnnotation: StandoffAnnotation
	): StandoffAnnotation {
		let found: StandoffAnnotation = null
		let i = startAnnotation.index - 1
		let curr: StandoffAnnotation
		while (found == null && i >= 0) {
			curr = this.atIndex(i)
 			if (predicate(curr) && curr.end <= startAnnotation.start) found = curr
			i--
		}
		return found
	}

	findAfter(
		predicate: FilterFunction<StandoffAnnotation>,
		startAnnotation: StandoffAnnotation
	): StandoffAnnotation {
		const { length } = this.standoff.annotations

		let found: StandoffAnnotation = null
		let i = startAnnotation.index + 1
		let curr: StandoffAnnotation

		while (found == null && i < length) {
			curr = this.atIndex(i)
 			if (predicate(curr) && startAnnotation.end <= curr.start) found = curr
			i++
		}

		return found
	}

	exportXml() {
		return exportXml(this.createTree(), this.options)
	}

	exportReactTree() {
		return exportReactTree(this.createTree(), this.options)
	}

	update() {
		this.standoff.annotations.forEach((a, i) => { a.index = i })

		this.lookup = this.standoff.annotations
			.reduce<Map<string, StandoffAnnotation>>((prev, curr) => {
				prev.set(curr.id, curr)
				return prev
			}, new Map())

		this.standoff.annotations.sort(sortByOffset(this.options))
	}

	atIndex(index: number) {
		return this.standoff.annotations[index]
	}

	byId(id: string) {
		return this.lookup.get(id)
	}

	private getRoot() {
		return this.standoff.annotations.find(a =>
			a.start === 0 && a.end === this.standoff.text.length
		)
	}

	private lint(): LintReport {
		return {
			overlap: this.overlapController.report(),
		}
	}

	private resolve(report: LintReport = this.lint()) {
		if (report.overlap.length) this.overlapController.resolve()
	}

	private createTree() {
		this.resolve()

		return standoff2tree(
			this,
			this.standoff.text,
			this.options
		)
	}
}
