import { AnnotationNode } from "."
import { ExportOptions } from './export-options'

import type { PartialStandoffAnnotation, StandoffAnnotation } from "."
import { TagShape } from "../enum"

export function simpleAnno({ name, start, end }: StandoffAnnotation) {return { name, start, end }}

export function isPartialAnnotation(annotation: any): annotation is PartialStandoffAnnotation {
	return (
		annotation.hasOwnProperty('name') &&
		annotation.hasOwnProperty('start')
	)
}

// TODO make a check for AnnotationNode
export function isAnnotation(annotation: any): annotation is StandoffAnnotation {
	if (annotation == null) return false

	return (
		annotation.hasOwnProperty('index') && // check index first, because it is not present in a PartialStandoffAnnotation
		isPartialAnnotation(annotation)
	)
}

// Implementation from _underscore
// export function isFunction(obj: any): boolean {
// 	return !!(obj && obj.constructor && obj.call && obj.apply)
// }

/** Check if annotation is child of parent */
// TODO remove or replace by isChild from annotation-tree3
export function isChild(child: PartialStandoffAnnotation, parent: PartialStandoffAnnotation): boolean {
	if (parent == null || child == null || parent === child) return false
	if (parent.tagShape === TagShape.SelfClosing) return false
	if (child.tagShape === TagShape.SelfClosing) {
		return parent.start <= child.start && parent.end >= child.start
	}
	return parent.start <= child.start && parent.end >= child.end
}

/** Check if annotation1 comes after annotation2 */
function isAfter(annotation1: StandoffAnnotation, annotation2: StandoffAnnotation): boolean {
	return annotation1.start >= annotation2.end
}

export function hasOverlap(annotation1: StandoffAnnotation, annotation2: StandoffAnnotation): boolean {
	return (
		!isAfter(annotation2, annotation1) &&
		!isChild(annotation2, annotation1) &&
		annotation1 !== annotation2
	)
}

function sortByHierarchy(options: ExportOptions) {
	return function(a: StandoffAnnotation, b: StandoffAnnotation) {
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
export function sortByOffset(options: ExportOptions) {
	const sbh = sortByHierarchy(options)

	return function (a: StandoffAnnotation, b: StandoffAnnotation) {
		if (a.metadata._isRoot) return 0
		if (b.metadata._isRoot) return 1

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

/**
 * Convert a {@link PartialStandoffAnnotation} to a {@link StandoffAnnotation}
 * 
 * @param annotation 
 * @returns 
 * 
 * @todo add clone (and add tests to check if cloning works properly)
 */
export function extendStandoffAnnotation(annotation: PartialStandoffAnnotation): StandoffAnnotation {
	if (annotation.end == null) annotation.tagShape = TagShape.SelfClosing

	if (
		annotation.tagShape === TagShape.SelfClosing &&
		annotation.end !== annotation.start
	) annotation.end = annotation.start

	return {
		end: annotation.start,
		endOrder: null,
		id: annotation.id == null ? Math.random().toString().slice(2) : null,
		index: null,
		tagShape: TagShape.Default,
		metadata: {},
		startOrder: null,
		...annotation,
	}
}

/**
 * Convert a {@link PartialStandoffAnnotation} to a {@link AnnotationNode}
 * 
 * @param annotation 
 * @returns 
 * 
 * @todo add clone (and add tests to check if cloning works properly)
 */
export function toAnnotationNode(annotation: PartialStandoffAnnotation): AnnotationNode {
	if (annotation.end == null) annotation.tagShape = TagShape.SelfClosing

	if (
		annotation.tagShape === TagShape.SelfClosing &&
		annotation.end !== annotation.start
	) annotation.end = annotation.start

	return {
		end: annotation.start,
		endOrder: null,
		id: annotation.id == null ? Math.random().toString().slice(2) : null,
		index: null,
		tagShape: TagShape.Default,
		metadata: {},
		startOrder: null,
		parent: null,
		children: [],
		...annotation,
	}
}



/**
 * Get the gaps between annotations. A gap occurs when two annotations
 * have text content between them.
 * 
 * @example `<a>this is a</a> gap <b>, for sure!</b>`: " gap " = [10, 14]
 */
// export function getGaps(annotations: StandoffAnnotation[]) {
// 	let end = annotations[0].end;

// 	const gaps = annotations.reduce<[number, number][]>((prev, curr, _index, _array) => {
// 		if (curr.start > end) prev.push([end, curr.start])
// 		if (curr.end > end) end = curr.end
// 		return prev
// 	}, [])	

// 	return gaps
// }
