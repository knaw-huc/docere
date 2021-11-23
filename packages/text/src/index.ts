import React from 'react'

import { isTextNode, StandoffTree3, generateAnnotationId, Annotation3 } from '@docere/common'

import type { ComponentProps, DocereComponents, Node, ReactComponent } from '@docere/common'

export type { DocereComponents } from '@docere/common'
export { StandoffTree3 as Bla } from '@docere/common'

function Empty(props: ComponentProps) {
	return props.children
}

// function Highlight(text: string) {
// 	return React.createElement(
// 		'span',
// 		{
// 			key: generateAnnotationId(),
// 			style: { backgroundColor: 'yellow' }
// 		},
// 		text
// 	)
// }

function getComponentRenderer(props: DocereTextViewProps) {
	function getComponent(annotation: Annotation3) {
		let component = props.components[annotation.name]
		if (component == null && props.components._find != null) {
			component = props.components._find(annotation)
		}
		if (component == null) component = Empty as ReactComponent

		return component
	}

	return function renderComponent(node: Node): JSX.Element | string {
		if (isTextNode(node)) {
			if (node.hasOwnProperty('rangeAnnotation')) {
				return React.createElement(
					getComponent(node.rangeAnnotation),
					{
						annotation: node.rangeAnnotation,
						key: generateAnnotationId(),
					},
					node.text
				)
			}
			return node.text
		}

		const annotation = props.standoffTree.lookup.get(node.id)

		return React.createElement(
			getComponent(annotation),
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
