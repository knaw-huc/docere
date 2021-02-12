import React from 'react'
import { fetchXml, attrsToObject } from './utils'

import type { ReactComponent } from '@docere/common'
import type { DocereTextViewProps } from '.'
import type { ComponentLeaf, ComponentTree } from './types'
import { MARK_TAG_NAME, useHighlight } from './use-highlight'

function NoopComp(props: any) { return props.children } 

function DocereMark(props: { children: React.ReactNode }) { return <mark>{props.children}</mark>}

function getComponentClass(el: Element, props: DocereTextViewProps): ReactComponent {
	const foundIgnore = props.ignore.some(selector => el.matches(selector))
	if (foundIgnore) return null

	if (el.tagName === MARK_TAG_NAME) return props.components.hasOwnProperty(MARK_TAG_NAME) ?
		props.components[MARK_TAG_NAME] :
		DocereMark

	const selector = Object.keys(props.components).find(selector => el.matches(selector))
	if (selector == null) return NoopComp

	return props.components[selector]
}

function nodeToComponentTree(root: Element, props: DocereTextViewProps, rootIndex?: string): ComponentLeaf {
	// If root is null or undefined, return null, which is a valid output for a React.Component
	if (root == null) return null

	// If root is a text node, just return the text content, which is a valid child for a React.Component
	if (root.nodeType === 3) return root.textContent

	// Only process Elements after this
	if (root.nodeType !== 1) return null
	const element = root as Element

	const componentClass = getComponentClass(element, props)
	if (componentClass == null) return null

	// Create the React.Component
	return { 
		componentClass,
		props: {
			attributes: attrsToObject(element.attributes),
			key: rootIndex,
		},
		children: Array.from(element.childNodes).map((childNode, index) => nodeToComponentTree(childNode as Element, props, `${rootIndex}-${index}`))
	}
}

function prepareNode(node: Node, props: DocereTextViewProps): Element {
	const el = (node instanceof XMLDocument || node instanceof HTMLDocument) ?
		node.documentElement :
		node as Element

	const prepared = props.prepare != null ?
		props.prepare(el) :
		el

	return prepared
}

const preparedNodeCache = new Map<string|Node, Element>()
function preparedNodeFromCache(props: DocereTextViewProps) {
	const key = props.url || props.node || props.xml || props.html	
	if (key == null) return null
	return preparedNodeCache.get(key)
}

function preparedNodeToCache(node: Element, props: DocereTextViewProps) {
	const key = props.url || props.node || props.xml || props.html	
	if (key == null) return null
	return preparedNodeCache.set(key, node)
}

/**
 * Hook for creating and updating of the component tree 
 * 
 * The component tree is the root Element mapped to custom components, in
 * the from of what React.createElement expects as parameters
 * 
 * @param props 
 */
export function useGetComponentTree(props: DocereTextViewProps) {
	const [componentTree, setComponentTree] = React.useState<ComponentTree | undefined>(null)
	const [node, setNode] = React.useState<Element>(null)

	/**
	 * Set the @docere/text root element. If one of the props (url, node, xml, html)
	 * changes, a new root element will be fetched/parsed/created and prepared. Root
	 * elements are chached, to avoid unnecessary re-fechting/re-parsing/re-creating
	 * and re-preparing.
	 * 
	 * There are three props options.
	 * 1 `node`: a node (HTMLDocument, XMLDocument, Element) is directly passed to the Component.
	 * 2 `(x|ht)ml`: a string of XML or HTML is parsed by DOMParser.
	 * 3 `url`: an XMLDocument is fetched by XMLHttpRequest.
	 */
	React.useEffect(() => {
		if (props.components == null) return

		const cachedPreparedNode = preparedNodeFromCache(props)
		if (cachedPreparedNode != null) return setNode(cachedPreparedNode)

		if (props.url != null) {
			fetchXml(props.url)
				.then(node => {
					const prepared = prepareNode(node, props)
					preparedNodeToCache(prepared, props)
					setNode(prepared)
				})
				.catch(() => setComponentTree(undefined))
		} else {
			let tmpNode: Node

			if (props.node != null) {
				tmpNode = props.node
			}
			else if (props.xml != null || props.html != null) {
				const parser = new DOMParser()
				const content = props.xml != null ? props.xml : props.html
				const mime = props.xml != null ? 'application/xml' : 'text/html'
				tmpNode = parser.parseFromString(content, mime)
			}

			const prepared = prepareNode(tmpNode, props)
			preparedNodeToCache(prepared, props)
			setNode(prepared)
		}
	}, [props.html, props.node, props.url, props.xml, props.components])

	/**
	 * Create and set the component tree.
	 * 
	 * If the node or the highlight query changes, the component tree has 
	 * to be re-created. 
	 * 
	 * In an earlier version the highlighting was done after the component tree
	 * is created. This has the benefit the component tree only has to be
	 * created once per @docere/text instance. The only problem was that altering 
	 * the DOM did not work well with React and DOM parts where 'copied' during 
	 * re-renders, creating mangled texts.
	 */
	React.useEffect(() => {
		useHighlight(node, props.highlight, props.setHighlightAreas)
		const componentTree = nodeToComponentTree(node, props)
		setComponentTree(componentTree as ComponentTree)
	}, [node, props.highlight])

	return componentTree
}
