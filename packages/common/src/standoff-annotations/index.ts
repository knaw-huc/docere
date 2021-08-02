import React from 'react'
import { FacsimileArea } from '../entry/facsimile'

export * from './annotation-tree'
export * from './utils'
export * from './export-options'

export const ROOT_NODE_NAME = 'root'
export const TEXT_NODE_NAME = '__TEXT_NODE__'
export const RANGE_TAG_NAME = '_range'

/**
 * The source for {@link AnnotationList} and {@link AnnotationTree}
 */
// export interface PartialStandoff2<T extends PartialStandoffAnnotation> {
// 	annotations: T[]
// 	metadata: Record<string, any>
// 	text: string
// }

// TODO remove?
export interface PartialStandoff {
	annotations: PartialStandoffAnnotation[]
	metadata: Record<string, any>
	text: string
}

/**
 * Annotations in {@link AnnotationTree} are extends with {@link extendStandoffAnnotation}
 * resulting in {@link StandoffAnnotation}s.
 */
export interface Standoff extends PartialStandoff {
	annotations: StandoffAnnotation[]
}

export interface AnnotationNode extends StandoffAnnotation {
	children: AnnotationNode[]
	parent: AnnotationNode
}


export interface StandoffAnnotationMetadata {
	_areas?: FacsimileArea[]
	_entityConfigId?: string
	_entityId?: string
	_isRoot?: boolean
	// _entityValue?: string
	_facsimileId?: string
	_facsimilePath?: string
	_range?: Set<string>
	_textContent?: string
	[prop: string]: any
}

/**
 * Partial standoff annotations are used in {@link StandoffWrapper}.
 * When used in {@link StandoffTree} the annotations are extended
 * to a {@link StandoffAnnotation}.
 * 
 * @todo remove index, because it is added by AnnotationList and should only be present on StandoffAnnotation?
 */
export interface PartialStandoffAnnotation {
	end?: number
	endOrder?: number
	id?: string
	isSelfClosing?: boolean
	metadata?: StandoffAnnotationMetadata
	name: string
	start: number
	startOrder?: number
}

/**
 * A standoff annotation as present in an {@link StandoffWrapper}
 * or {@link StandoffTree}
 * 
 * The StandoffAnnotation is created from the {@link PartialStandoffAnnotation}
 * in the constructor of the {@link StandoffTree} with {@link extendStandoffAnnotation}
 */
// export type StandoffAnnotation = Required<PartialStandoffAnnotation>
export interface StandoffAnnotation extends Required<PartialStandoffAnnotation> {
	index: number
}

// export type FilterFunction = (a: PartialStandoffAnnotation) => boolean
// export type FilterFunction<T extends PartialStandoffAnnotation> = (a: T) => boolean
export type FilterFunction = (a: AnnotationNode) => boolean

export type OverlapReport = [StandoffAnnotation, StandoffAnnotation][]

export interface LintReport {
	overlap: OverlapReport
}

export type DocereAnnotationProps = AnnotationNode['metadata'] & {
	_key?: string
	_ref?: string
	key: string | number // Docere only uses strings, but StyledComponents can have numbers
}

export type ComponentProps = DocereAnnotationProps & {
	children: React.ReactNode
}

export type EntityAnnotationComponentProps = Pick<ComponentProps, 'key' | '_entityId' | 'children'>

export interface DocereAnnotation {
	children?: (DocereAnnotation | string)[]
	props?: DocereAnnotationProps
	type: string
}
