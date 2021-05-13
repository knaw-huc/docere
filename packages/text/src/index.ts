import React from 'react'

import { DocereComponents, DocereAnnotation, DocereAnnotationProps } from '@docere/common'

export type { DocereComponents } from '@docere/common'

function Empty(props: DocereAnnotationProps) {
	if (props.children == null) return null
	return props.children
}

function renderComponentTree(root: DocereAnnotation, props: DocereTextViewProps): JSX.Element
function renderComponentTree(textNode: string, props: DocereTextViewProps): string
function renderComponentTree(root: DocereAnnotation | string, props: DocereTextViewProps): JSX.Element | string
function renderComponentTree(root: DocereAnnotation | string, props: DocereTextViewProps): JSX.Element | string {
	if (typeof root === 'string') return root

	let component = props.components[root.type]
	if (component == null && props.components._find != null) {
		component = props.components._find(root)
	}
	if (component == null) component = Empty

	return React.createElement(
		component,
		root.props,
		root.children?.map(child => renderComponentTree(child, props))
	)
}

export interface DocereTextViewProps {
	components?: DocereComponents
	highlight?: string | string[]
	ignore?: string[]
	onLoad?: (isReady: boolean, el: Element) => void
	prepare?: (node: Element) => Element
	setHighlightAreas?: (areas: number[]) => void
	tree: DocereAnnotation
}

function DocereTextView_(props: DocereTextViewProps) {
	if (props.tree == null || props.components == null) return null

	return renderComponentTree(props.tree, props)
}

export const DocereTextView = React.memo(DocereTextView_)
