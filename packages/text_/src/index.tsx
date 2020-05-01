import React from 'react'
import useGetComponentTree from './use-get-component-tree'
import useHighlight from './use-highlight'
import useComponentDidMount from './use-component-did-mount'

import type { DocereComponents } from '@docere/common'
import type { ComponentLeaf } from './types'

export type { DocereComponents } from '@docere/common'

function renderComponentTree(tree: ComponentLeaf, props: DocereTextViewProps): React.ReactNode {
	if (tree == null || typeof tree === 'string') return tree

	return React.createElement(
		tree.componentClass,
		{ ...props.customProps, ...tree.props },
		tree.children.map(child => renderComponentTree(child, props))
	)
}

export interface DocereTextViewProps {
	components?: DocereComponents
	// TODO rename to componentProps
	customProps?: { [ key: string ]: any }
	highlight?: string | string[]
	html?: string
	ignore?: string[]
	onLoad?: (isReady: boolean) => void
	node?: Node
	onRootElementChange?: (newRoot: Element) => void
	rootSelector?: string
	setHighlightAreas?: (areas: number[]) => void
	url?: string
	xml?: string
}
function DocereTextView(props: DocereTextViewProps) {
	const wrapperRef = React.useRef()
	const componentTree = useGetComponentTree(props)
	useHighlight(wrapperRef, componentTree, props.highlight, props.setHighlightAreas)

	const tree = renderComponentTree(componentTree, props)
	useComponentDidMount(props, tree)
	
	return (
		<div ref={wrapperRef}>
			{tree}
		</div>
	)
}

DocereTextView.defaultProps = {
	customProps: {},
	components: {},
	ignore: [],
	highlight: [],
}

/*
 * Use a custom areEqual function because customProps does not pass the shallow comparison
 */
export default React.memo(
	DocereTextView,
	function areEqual(prevProps: any, nextProps: any) {
		const equalProps = Object.keys(prevProps).every(k => {
			// if (prevProps.customProps[k] !== prevProps.customProps[k]) console.log(k, prevProps.customProps[k])
			if (k === 'customProps') return true
			return prevProps[k] === nextProps[k]
		})

		const equalCustomProps = Object.keys(prevProps.customProps).every(k => {
			// if (prevProps.customProps[k] !== nextProps.customProps[k]) console.log(k, nextProps.customProps[k])
			return prevProps.customProps[k] === nextProps.customProps[k]
		})

		return equalProps && equalCustomProps
	}
)
