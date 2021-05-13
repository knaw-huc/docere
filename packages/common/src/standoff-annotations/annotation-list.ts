import { isChild, isPartialAnnotation } from './utils'
import { PartialStandoffAnnotation, PartialStandoff2, FilterFunction } from "."

/**
 * A thin wrapper around a {@link PartialStandoff} or {@link Standoff}
 * 
 * It adds basic functionality to alter the annotations. Pure standoff
 * annotations don't have fixed (sorting) order, so changing the annotations
 * is fast. When used as a {@link StandoffTree} this changes and alterations
 * have to be accompanied by an {@link StandoffTree.update} in order to 
 * keep the StandoffTree valid
 */
export class StandoffWrapper<T extends PartialStandoffAnnotation> {
	get annotations() {
		return this.standoff.annotations
	}

	constructor(public standoff: PartialStandoff2<T>) {}

	add(annotation: T) {
		this.standoff.annotations.push(annotation)
	}

	remove(annotation: T): void
	remove(predicate: FilterFunction<T>): void
	remove(predicate: T | FilterFunction<T>): void {
		if (isPartialAnnotation(predicate)) {
			predicate = (a) => predicate === a
		}

		this.standoff.annotations = this.standoff.annotations.filter(predicate)
	}

	updateOffsets(annotation: T, start: number, end?: number) {
		if (start != null) annotation.start = start
		if (end != null) annotation.end = end
	}

	convertToMilestone(predicate: (a: T) => boolean, transferTextContent = false) {
		this.standoff.annotations
			.filter(predicate)
			.forEach(a => {
				if (transferTextContent) {
					a.metadata._textContent = this.getTextContent(a)
				}
				a.end = a.start
				a.isSelfClosing = true
			})
	}

	split(annotation: T, offset: number) {
		if (annotation == null || offset == null) return

		const newAnnotation: T = JSON.parse(JSON.stringify(annotation))
		newAnnotation.id = Math.random().toString().slice(2)
		newAnnotation.start = offset
		this.add(newAnnotation)

		this.updateOffsets(annotation, null, offset)
	}

	getTextContent(annotation?: T) {
		if (annotation == null) return this.standoff.text
		if (annotation.isSelfClosing) return ''
		return this.standoff.text.slice(annotation.start, annotation.end)
	}

	addRoot(annotation: T) {
		this.add({
			...annotation,
			end: this.standoff.text.length,
			start: 0,
		})
	}

	getSibling(a: T) {
		const parent = this.findParent(a)
		const children = this.getDirectChildren(parent)
		return children.find(child => child !== a && a.end <= child.start)
	}

	getPreviousSibling(a: T) {
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

	findParent(annotation: T, subset = this.standoff.annotations) {
		return subset
			.reduce<T>((prev, curr) => {
				if (!isChild(annotation, curr)) return prev

				if (prev == null) return curr

				if (
					prev.start <= curr.start && 
					prev.end >= curr.end
				) return curr

				return prev
			}, null)
	}

	getDirectChildren(parent: T) {
		const children = this.getChildren(parent)
		const possibleParents = children.concat(parent)

		return children
			.filter(child =>
				this.findParent(child, possibleParents) === parent
			)
	}

	getChildren(parent: T, filter?: FilterFunction<T>) {
		if (filter == null) filter = () => true

		return this.standoff.annotations.filter(annotation =>
			filter(annotation) &&
			isChild(annotation, parent)
		)
	}
}

// type BulkOperation = AddOperation | RemoveOperation | SplitOperation | UpdateOffsetsOperation | ConvertToMilestoneOperation

// bulk(operations: BulkOperation[]) {

// }

