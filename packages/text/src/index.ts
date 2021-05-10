import React from 'react'

import { DocereComponents, DocereAnnotation } from '@docere/common'

export type { DocereComponents } from '@docere/common'

function Empty(props: any) {
	if (props.children == null) return null
	return props.children
}

function renderComponentTree(tree: DocereAnnotation, props: DocereTextViewProps): JSX.Element
function renderComponentTree(tree: string, props: DocereTextViewProps): string
function renderComponentTree(tree: DocereAnnotation | string, props: DocereTextViewProps): JSX.Element | string
function renderComponentTree(tree: DocereAnnotation | string, props: DocereTextViewProps): JSX.Element | string {
	if (typeof tree === 'string') return tree

	let component = props.components[tree.type]
	if (component == null && props.components._find != null) {
		component = props.components._find(tree)
	}
	if (component == null) component = Empty

	return React.createElement(
		component,
		tree.props,
		tree.children?.map(child => renderComponentTree(child, props))
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
