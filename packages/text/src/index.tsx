import React from 'react'
import styled from 'styled-components'
import useGetComponentTree from './use-get-component-tree'
import useHighlight from './use-highlight'
import useComponentDidMount from './use-component-did-mount'

import type { DocereComponents } from '@docere/common'
import type { ComponentLeaf } from './types'

export type { DocereComponents } from '@docere/common'

export { highlightQueryInDomElement } from './use-highlight'

const Error = styled.div`
	background: darkred;
	border-radius: .25em;
	color: white;
	display: inline-block;
	font-size: 1.5rem;
	font-weight: bold;
	padding: 1em;
`

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
	onLoad?: (isReady: boolean, el: Element) => void
	node?: Node
	prepare?: (node: Element) => Element
	setHighlightAreas?: (areas: number[]) => void
	url?: string
	xml?: string
}
function DocereTextView(props: DocereTextViewProps) {
	const wrapperRef = React.useRef()
	const componentTree = useGetComponentTree(props)

	const tree = renderComponentTree(componentTree, props)
	useComponentDidMount(props, tree, wrapperRef.current)
	
	// console.log(wrapperRef.current.outerHTML)
	useHighlight(wrapperRef, tree, props.highlight, props.setHighlightAreas)

	if (componentTree === undefined) {
		return <Error>Failed to fetch {props.url}</Error>
	}

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
			// if (prevProps.customProps[k] !== prevProps.customProps[k]) console.log('prop', k, prevProps.customProps[k])
			if (k === 'customProps') return true
			return prevProps[k] === nextProps[k]
		})

		const equalCustomProps = Object.keys(prevProps.customProps).every(k => {
			// if (prevProps.customProps[k] !== nextProps.customProps[k]) console.log('custom prop', k, nextProps.customProps[k])
			return prevProps.customProps[k] === nextProps.customProps[k]
		})

		// console.log(equalProps, equalCustomProps, equalProps && equalCustomProps)
		return equalProps && equalCustomProps
	}
)
