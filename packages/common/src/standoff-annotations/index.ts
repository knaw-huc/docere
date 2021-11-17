import React from 'react'
import { EntityConfig } from '../entry/entity'
import { FacsimileArea } from '../entry/facsimile'
import { Annotation3 } from './annotation-tree3'

export enum TagShape {
	Default = 'default',
	Range = 'range',
	SelfClosing = 'self-closing'
}

// export * from './annotation-tree'
export * from './annotation-tree3'
export * from './utils'
export * from './export-options'

export const ROOT_NODE_NAME = 'docere_document'
// export const TEXT_NODE_NAME = '__TEXT__'
export const HIGHLIGHT_NODE_NAME = '__HI__'
// export const RANGE_TAG_NAME = '_range'

/**
 * The source for {@link AnnotationList} and {@link AnnotationTree}
 */
// export interface PartialStandoff2<T extends PartialStandoffAnnotation> {
// 	annotations: T[]
// 	metadata: Record<string, any>
// 	text: string
// }

export function isPartialStandoff(standoff: any): standoff is PartialStandoff {
	if (standoff == null) return false

	return standoff.hasOwnProperty('annotations') && 
		standoff.hasOwnProperty('metadata') &&
		standoff.hasOwnProperty('text')
}

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
// export interface Standoff extends PartialStandoff {
// 	annotations: AnnotationNode[]
// }

// export interface AnnotationNode extends StandoffAnnotation {
// 	children: AnnotationNode[]
// 	parent: AnnotationNode
// }


// export interface StandoffAnnotationMetadata {
// 	_areas?: FacsimileArea[]
// 	_entityConfigId?: string
// 	_entityId?: string
// 	_isRoot?: boolean
// 	// _entityValue?: string
// 	_facsimileId?: string
// 	_facsimilePath?: string
// 	_range?: Set<string>
// 	_textContent?: string
// 	[prop: string]: any
// }

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
	name: string
	props?: {
		areas?: FacsimileArea[]
		entityConfig?: EntityConfig
		entityConfigId?: string
		entityId?: ReturnType<EntityConfig['getId']>
		entityOrder?: number
		entityValue?: ReturnType<EntityConfig['getValue']>
		isRoot?: boolean
		isRangeStart?: boolean
		isRangeBody?: boolean
		isRangeEnd?: boolean
		facsimileId?: string
		facsimilePath?: string
		rangeId?: string
		textContent?: string
	}
	sourceProps?: Record<string, any>
	start: number
	startOrder?: number
	tagShape?: TagShape
}

/**
 * A standoff annotation as present in an {@link StandoffWrapper}
 * or {@link StandoffTree}
 * 
 * The StandoffAnnotation is created from the {@link PartialStandoffAnnotation}
 * in the constructor of the {@link StandoffTree} with {@link extendStandoffAnnotation}
 */
// export type StandoffAnnotation = Required<PartialStandoffAnnotation>
// export interface StandoffAnnotation extends Required<PartialStandoffAnnotation> {
// 	index: number
// }

export type FilterFunction = (a: PartialStandoffAnnotation) => boolean
// export type FilterFunction<T extends PartialStandoffAnnotation> = (a: T) => boolean
// export type FilterFunction = (a: AnnotationNode) => boolean

// export type OverlapReport = [StandoffAnnotation, StandoffAnnotation][]

// export interface LintReport {
// 	overlap: OverlapReport
// }

// export type DocereAnnotationProps = AnnotationNode['metadata'] & {
// 	_key?: string
// 	_ref?: string
// 	key: string | number // Docere only uses strings, but StyledComponents can have numbers
// }

export interface ComponentProps {
	annotation: Annotation3
	children?: React.ReactNode
 	key: string | number // Docere only uses strings, but StyledComponents can have numbers
}

export type EntityAnnotationComponentProps = ComponentProps

// export interface DocereAnnotation {
// 	children?: (DocereAnnotation | string)[]
// 	props?: DocereAnnotationProps
// 	type: string
// }
