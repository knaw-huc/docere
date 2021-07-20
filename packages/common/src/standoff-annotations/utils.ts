import { AnnotationNode, ROOT_NODE_NAME } from "."

import type { Standoff, PartialStandoffAnnotation, ExportOptions, PartialExportOptions, StandoffAnnotation } from "."

export function extendExportOptions(options: PartialExportOptions): ExportOptions {
	return {
		annotationHierarchy: [],
		rootNodeName: ROOT_NODE_NAME,
		...options,
		metadata: {
			exclude: null,
			include: null,
			addId: true,
			addOffsets: false,
			...options.metadata,
		},
	}
}

export function simpleAnno({ name, start, end }: StandoffAnnotation) {return { name, start, end }}

export function isPartialAnnotation(annotation: any): annotation is PartialStandoffAnnotation {
	return (
		annotation.hasOwnProperty('name') &&
		annotation.hasOwnProperty('start')
	)
}

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
export function isChild(child: PartialStandoffAnnotation, parent: PartialStandoffAnnotation): boolean {
	if (parent == null || child == null || parent === child) return false
	if (parent.isSelfClosing) return false
	if (child.isSelfClosing) {
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

		if (indexA > indexB) return 1
		if (indexA < indexB) return -1

		return 0
	}
}

export function sortByOffset(options: ExportOptions) {
	const sbh = sortByHierarchy(options)

	return function (a: StandoffAnnotation, b: StandoffAnnotation) {
		if (
			(a.start === b.start && a.end === b.end) ||
			((a.isSelfClosing || b.isSelfClosing) && a.start === b.start)
		) {
			return sbh(a, b)
		}

		if (isAfter(a, b)) return 1
		if (isAfter(b, a)) return -1

		if (isChild(a, b)) return 1
		if (isChild(b, a)) return -1

		return sbh(a, b)
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
	return {
		end: annotation.start,
		endOrder: null,
		id: annotation.id == null ? Math.random().toString().slice(2) : null,
		index: null,
		isSelfClosing: false,
		metadata: {},
		startOrder: null,
		...annotation,
	}
}

export function createRoot(standoff: Standoff, options: ExportOptions): StandoffAnnotation {
	return extendStandoffAnnotation({
		end: standoff.text.length,
		metadata: standoff.metadata,
		name: options.rootNodeName,
		start: 0,
	})
}

export function createAnnotationNode(annotation: StandoffAnnotation): AnnotationNode {
	return {
		...annotation,
		children: [],
		parent: null,
	}
}
