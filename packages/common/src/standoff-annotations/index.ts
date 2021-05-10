import React from 'react'
import { FacsimileArea } from '../entry/facsimile'

export * from './annotation-list'
export * from './annotation-tree'
export * from './utils'

export const ROOT_NODE_NAME = 'root'
export const TEXT_NODE_NAME = '__TEXT_NODE__'
export const RANGE_TAG_NAME = '_range'

export interface Standoff {
	annotations: PartialStandoffAnnotation[]
	metadata: Record<string, any>
	text: string
}

export interface AnnotationNode extends PartialStandoffAnnotation {
	children: AnnotationNode[]
	parent: AnnotationNode
}


export interface StandoffAnnotationMetadata {
	_areas?: FacsimileArea[]
	_entityId?: string
	_entityConfigId?: string
	_facsimileId?: string
	_range?: Set<string>
	_textContent?: string
	[prop: string]: any
}

export interface PartialStandoffAnnotation {
	end?: number
	endOrder?: number
	id?: string
	index?: number
	isSelfClosing?: boolean
	metadata?: StandoffAnnotationMetadata
	name: string
	start: number
	startOrder?: number
}

export type StandoffAnnotation = Required<PartialStandoffAnnotation>

export type FilterFunction = (a: StandoffAnnotation) => boolean

export type PartialExportOptions = Partial<Omit<ExportOptions, 'metadata'>> & { metadata?: Partial<ExportOptions['metadata']> }

export interface ExportOptions {
	annotationHierarchy: string[]
	metadata: {
		exclude: string[]
		include: string[]
		addId: boolean
		addOffsets: boolean
	}
	rootNodeName: string
}

export type OverlapReport = [StandoffAnnotation, StandoffAnnotation][]

export interface LintReport {
	overlap: OverlapReport
	hasRoot: boolean
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
