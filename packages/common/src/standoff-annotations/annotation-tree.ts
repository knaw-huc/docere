import { createRoot, isChild, sortByOffset } from './utils'
import { AnnotationList } from './annotation-list'
import { standoff2tree } from './standoff2tree'
import { exportXml } from './export-xml'
import { exportReactTree } from './export-react-tree'
import { OverlapController } from './overlap-controller'

import type { LintReport, PartialExportOptions, Standoff, PartialStandoffAnnotation, StandoffAnnotation } from '.'

// @ts-ignore
import { simpleAnno } from './utils'

type FilterFunction = (a: StandoffAnnotation) => boolean

export class AnnotationTree extends AnnotationList {
	private overlapController: OverlapController

	constructor(
		standoff: Standoff,
		options: PartialExportOptions = {}
	) {
		super(standoff, options)
		this.overlapController = new OverlapController(this)
	}

	addRoot(annotation: Pick<PartialStandoffAnnotation, 'name' | 'metadata'>) {
		this.add({
			...annotation,
			end: this.standoff.text.length,
			start: 0,
		})
	}

	getSibling(a: StandoffAnnotation) {
		const parent = this.findParent(a)
		const children = this.getDirectChildren(parent)
		return children.find(child => child !== a && a.end <= child.start)
	}

	getPreviousSibling(a: StandoffAnnotation) {
		const parent = this.findParent(a)
		const children = this.getDirectChildren(parent)
		return children.reduce((prev, child) => {
			if (child !== a && child.end <= a.start) {
				if (prev == null) return child
				return child.end >= prev.end ? child : prev
			}
			return prev
		}, null)
	}

	findBefore(predicate: FilterFunction, startAnnotation: StandoffAnnotation): StandoffAnnotation {
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

	findAfter(predicate: FilterFunction, startAnnotation: StandoffAnnotation): StandoffAnnotation {
		let found: StandoffAnnotation = null
		let i = startAnnotation.index + 1
		let curr: StandoffAnnotation
		while (found == null && i < this.length) {
			curr = this.atIndex(i)
 			if (predicate(curr) && startAnnotation.end <= curr.start) found = curr
			i++
		}
		return found
	}

	findParent(annotation: StandoffAnnotation, subset = this.annotations) {
		return subset
			.reduce<StandoffAnnotation>((prev, curr) => {
				if (!isChild(annotation, curr)) return prev

				if (prev == null) return curr

				if (
					prev.start <= curr.start && 
					prev.end >= curr.end
				) return curr

				return prev
			}, null)
	}

	getDirectChildren(parent: StandoffAnnotation) {
		const children = this.getChildren(parent)
		const possibleParents = children.concat(parent)

		return children
			.filter(child =>
				this.findParent(child, possibleParents) === parent
			)
	}

	getChildren(parent: StandoffAnnotation, filter?: FilterFunction) {
		if (filter == null) filter = () => true

		return this.filter(annotation =>
			filter(annotation) &&
			isChild(annotation, parent)
		)
	}

	private createTree() {
		this.resolve()

		return standoff2tree(
			this,
			this.getStandoff(),
			this.options
		)
	}

	exportXml() {
		return exportXml(this.createTree(), this.options)
	}

	exportReactTree() {
		return exportReactTree(this.createTree(), this.options)
	}

	update() {
		this.annotations.sort(sortByOffset(this.options))
		super.update()
	}

	private hasRoot() {
		const root = this._annotations.find(a => a.start === 0 && a.end === this.standoff.text.length)
		return root != null
	}

	private lint(): LintReport {
		return {
			overlap: this.overlapController.report(),
			hasRoot: this.hasRoot(),
		}
	}

	private resolve(report: LintReport = this.lint()) {
		if (!report.hasRoot) {
			const root = createRoot(this.standoff, this.options)
			this.add(root)
			this.options.annotationHierarchy = [this.options.rootNodeName].concat(this.options.annotationHierarchy)
		}

		if (report.overlap.length) this.overlapController.resolve()
	}
}
