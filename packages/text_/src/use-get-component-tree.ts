import * as React from 'react'
import { /*wrap,*/ fetchXml, attrsToObject } from './utils'

function NoopComp(props: any) { return props.children } 

function getComponentClass(el: Element, props: DocereTextViewProps): ReactComponent {
	const foundIgnore = props.ignore.some(selector => el.matches(selector))
	if (foundIgnore) return null

	const selector = Object.keys(props.components).find(selector => el.matches(selector))
	if (selector == null) return NoopComp

	return props.components[selector]
}

function nodeToComponentTree(root: Node, props: DocereTextViewProps, rootIndex?: string): ComponentLeaf {
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
		children: Array.from(element.childNodes).map((childNode, index) => nodeToComponentTree(childNode, props, `${rootIndex}-${index}`))
	}
}

function prepareNode(node: Node, props: DocereTextViewProps): ComponentTree {
	if (node instanceof XMLDocument || node instanceof HTMLDocument) node = node.documentElement
	if (props.rootSelector != null) node = (node as Element).querySelector(props.rootSelector)
	return nodeToComponentTree(node, props) as ComponentTree
}

export default function useGetComponentTree(props: DocereTextViewProps) {
	const [node, setNode] = React.useState<ComponentTree>(null)

	/**
	 * Set the document. There are three props options.
	 * 1 `node`: a node (HTMLDocument, XMLDocument, Element) is directly passed to the Component.
	 * 2 `(x|ht)ml`: a string of XML or HTML is parsed by DOMParser.
	 * 3 `url`: an XMLDocument is fetched by XMLHttpRequest.
	 */
	React.useEffect(() => {
		if (props.components == null) return

		if (props.url != null) {
			fetchXml(props.url).then(node => setNode(prepareNode(node, props)))
		} else {
			let tmpNode: Node
			if (props.node != null) {
				tmpNode = props.node
			}
			else if (props.xml != null) {
				const parser = new DOMParser()
				tmpNode = parser.parseFromString(props.xml, 'application/xml')
			}
			else if (props.html != null) {
				const parser = new DOMParser()
				tmpNode = parser.parseFromString(props.html, 'text/html')
			}
			setNode(prepareNode(tmpNode, props))
		}
	}, [props.html, props.node, props.url, props.xml, props.components])

	return node
}
