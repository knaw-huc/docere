import React from 'react'

import { isTextNode, StandoffTree3, generateAnnotationId } from '@docere/common'

import type { ComponentProps, DocereComponents, Node, ReactComponent } from '@docere/common'

export type { DocereComponents } from '@docere/common'
export { StandoffTree3 as Bla } from '@docere/common'

function Empty(props: ComponentProps) {
	if (props.children == null) return null
	return props.children
}

function Highlight(text: string) {
	return React.createElement(
		'span',
		{
			key: generateAnnotationId(),
			style: { backgroundColor: 'yellow' }
		},
		text
	)
}

function getComponentRenderer(props: DocereTextViewProps) {
	return function renderComponent(node: Node): JSX.Element | string {
		if (isTextNode(node)) {
			if (node.hasOwnProperty('rangeAnnotation')) {
				return Highlight(node.text)
			} else {
				return node.text
			}
		}

		const annotation = props.standoffTree.lookup.get(node.id)

		let component = props.components[annotation.name]
		if (component == null && props.components._find != null) {
			component = props.components._find(annotation)
		}
		if (component == null) component = Empty as ReactComponent

		return React.createElement(
			component,
			{
				annotation,
				key: annotation.id,
			},
			node.children?.map(child => renderComponent(child))
		)
	}
}

export interface DocereTextViewProps {
	components?: DocereComponents
	highlight?: string[]
	standoffTree: StandoffTree3
}

export const DocereTextView = React.memo(
	function (props: DocereTextViewProps) {
		if (props.standoffTree == null || props.components == null) return null
		props.standoffTree.highlightSubString(props.highlight)
		const renderComponent = getComponentRenderer(props)
		return renderComponent(props.standoffTree.tree) as JSX.Element
	}
)
