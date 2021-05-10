import { extendStandoffAnnotation, extendExportOptions, isAnnotation, isFunction } from './utils'
import { Standoff, PartialStandoffAnnotation } from "."

import type { StandoffAnnotation, FilterFunction, ExportOptions, PartialExportOptions } from '.'

export class AnnotationList {
	options: ExportOptions
	protected _annotations: StandoffAnnotation[]
	private lookup: Map<string, StandoffAnnotation>

	get annotations() {
		return this._annotations
	}

	get length() {
		return this._annotations.length
	}

	constructor(protected standoff: Standoff, options: PartialExportOptions = {}) {
		this.options = extendExportOptions(options)
		this._annotations = standoff.annotations.map(extendStandoffAnnotation)
		this.update()
	}

	getStandoff(): Standoff {
		return {
			...this.standoff,
			annotations: this._annotations
		}
	}

	add(annotation: PartialStandoffAnnotation, update = true) {
		const next = extendStandoffAnnotation(annotation)
		this._annotations.push(next)
		if (update) this.update()
	}

	remove(annotation: FilterFunction, update?: boolean): void
	remove(annotation: StandoffAnnotation, update?: boolean): void
	remove(annotation: StandoffAnnotation | FilterFunction, update = true): void {
		if (isAnnotation(annotation)) {
			this._annotations.splice(annotation.index, 1)
		} else if (isFunction(annotation)) {
			this._annotations = this._annotations.filter(a => !annotation(a))
		}
		if (update) this.update()
	}

	updateOffsets(annotation: StandoffAnnotation, start: number, end?: number, update = true) {
		if (start != null) annotation.start = start
		if (end != null) annotation.end = end
		if (update) this.update()
	}

	convertToMilestone(predicate: FilterFunction, transferTextContent = false, update = true) {
		this._annotations
			.filter(predicate)
			.forEach(a => {
				if (transferTextContent) {
					a.metadata._textContent = this.getTextContent(a)
				}
				a.end = a.start
				a.isSelfClosing = true
			})
		if (update) this.update()
	}

	split(annotation: StandoffAnnotation, offset: number, update = true) {
		if (annotation == null || offset == null) return

		const newAnnotation = JSON.parse(JSON.stringify(annotation))
		newAnnotation.id = Math.random().toString().slice(2)
		newAnnotation.start = offset
		this.add(newAnnotation, false)

		this.updateOffsets(annotation, null, offset, false)

		if (update) this.update()
	}

	update() {
		this._annotations
			.forEach((a, i) => { a.index = i })

		this.lookup = this._annotations
			.reduce<Map<string, StandoffAnnotation>>((prev, curr) => {
				prev.set(curr.id, curr)
				return prev
			}, new Map())
	}

	atIndex(index: number) {
		return this._annotations[index]
	}

	byId(id: string) {
		return this.lookup.get(id)
	}

	find(filter: FilterFunction) {
		return this._annotations.find(filter)
	}

	filter(filter: FilterFunction) {
		return this._annotations.filter(filter)
	}

	getTextContent(annotation?: StandoffAnnotation) {
		if (annotation == null) return this.standoff.text
		return this.standoff.text.slice(annotation.start, annotation.end)
	}
}

// type BulkOperation = AddOperation | RemoveOperation | SplitOperation | UpdateOffsetsOperation | ConvertToMilestoneOperation

// bulk(operations: BulkOperation[]) {

// }

