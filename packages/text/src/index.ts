import React from 'react'

import { ComponentProps, DocereComponents, Node, ReactComponent, StandoffTree3 } from '@docere/common'

export type { DocereComponents } from '@docere/common'

function Empty(props: ComponentProps) {
	if (props.children == null) return null
	return props.children
}

function getComponentRenderer(props: DocereTextViewProps) {
	// const annotations = new Map(props.standoffTree.annotations)

	return function renderComponent(node: Node): JSX.Element | string {
		if (typeof node === 'string') return node

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
	highlight?: string | string[]
	ignore?: string[]
	onLoad?: (isReady: boolean, el: Element) => void
	prepare?: (node: Element) => Element
	setHighlightAreas?: (areas: number[]) => void
	standoffTree: StandoffTree3
}


export const DocereTextView = React.memo(
	function (props: DocereTextViewProps) {
		if (props.standoffTree == null || props.components == null) return null
		const renderComponent = getComponentRenderer(props)
		return renderComponent(props.standoffTree.tree) as JSX.Element
	}
)
