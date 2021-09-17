import React from 'react'

import { ComponentProps, DocereComponents, isTextNode, Node, ReactComponent, StandoffTree3 } from '@docere/common'

export type { DocereComponents } from '@docere/common'

function Empty(props: ComponentProps) {
	if (props.children == null) return null
	return props.children
}

function Hilight(text: string) {
	return React.createElement(
		'span',
		{
			key: Math.random().toString(),
			style: { backgroundColor: 'yellow' }
		},
		text
	)
}

function getComponentRenderer(props: DocereTextViewProps) {
	// const annotations = new Map(props.standoffTree.annotations)

	return function renderComponent(node: Node): JSX.Element | string {
		if (isTextNode(node)) {
			if (node.hasOwnProperty('rangeAnnotation')) {
				return Hilight(node.text)
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
	ignore?: string[]
	onLoad?: (isReady: boolean, el: Element) => void
	prepare?: (node: Element) => Element
	setHighlightAreas?: (areas: number[]) => void
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
