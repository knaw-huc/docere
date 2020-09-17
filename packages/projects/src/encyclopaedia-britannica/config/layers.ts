// import { LayerType } from '@docere/common'
// import type { TextLayer } from '@docere/common'

import { Entry } from '@docere/common'

/*
function updateToPosition(currentPosition: Position, el: Element): Position {
	const left = parseInt(el.getAttribute('HPOS'), 10)
	const top = parseInt(el.getAttribute('VPOS'), 10)
	const width = parseInt(el.getAttribute('WIDTH'), 10)
	const height = parseInt(el.getAttribute('HEIGHT'), 10)

	if (currentPosition == null) return { left, top, right: left + width, bottom: top + height }

	return {
		left: left < currentPosition.left ? left : currentPosition.left,
		top: top < currentPosition.top ? top : currentPosition.top,
		right: left + width > currentPosition.right ? left + width : currentPosition.right,
		bottom: top + height > currentPosition.bottom ? top + height : currentPosition.bottom,
	}
}

interface Position {
	top: number
	bottom: number
	left: number
	right: number
}
*/
export default function extractPreparedLayer(entry: Entry) {
	const element = entry.document.querySelector('Layout')

	const nodeIterator = document.createNodeIterator(
		element,
		NodeFilter.SHOW_ELEMENT,
		{
			acceptNode: (node) => {
				if (node.nodeName === 'String' || node.nodeName === 'TextLine') return NodeFilter.FILTER_ACCEPT
			}
		}
	)

	let node: Element
	let prevNodeName: string
	const possibleLemmas = []
	while ((node = nodeIterator.nextNode() as Element)) {
		const content = node.getAttribute('CONTENT')
		if (
			node.nodeName === 'String' &&
			prevNodeName === 'TextLine' &&
			content === content.toUpperCase() &&
			/[A-Z]/.test(content) &&
			content.length > 1
		) {
			possibleLemmas.push({
				content,
				id: node.getAttribute('ID'),
				left: parseInt(node.getAttribute('HPOS'), 10)
			})		
		}

		prevNodeName = node.nodeName
	}

	const lemmas = possibleLemmas
		.reduce(
			(prev, curr) => {
				if (prev.length === 0) {
					prev.push([curr])
				} else {
					const closeOne = prev.find(x => Math.abs(x[0].left - curr.left) < 15)
					if (closeOne != null) closeOne.push(curr)
					else prev.push([curr])
				}
				return prev
			}, [] as any[]
		)
		.sort((a, b) => b.length - a.length) // Sort by array length
		.slice(0, 2) // Keep the 2 biggest arrays
		.reduce((p, c) => p.concat(c), []) // Flatten 2 largests arrays

	const nodeIterator2 = document.createNodeIterator(
		element,
		NodeFilter.SHOW_ELEMENT,
		// {
		// 	acceptNode: (node) => {
		// 		if (node.nodeName === 'String' || node.nodeName === 'TextLine') return NodeFilter.FILTER_ACCEPT
		// 	}
		// }
	)

	const lemmaIds = new Set(lemmas.map((l: any) => l.id))

	const fragment = document.createElement('div')
	let currentArticle: HTMLElement
	let currentNode: Element
	while ((currentNode = nodeIterator2.nextNode() as Element)) {
		const content = currentNode.getAttribute('CONTENT')
		const isLemma = lemmaIds.has(currentNode.getAttribute('ID'))
		if (currentNode.nodeName === 'String' && isLemma) {
			if (currentArticle != null) {
				fragment.appendChild(currentArticle)
			}
			currentArticle = document.createElement('article')
			currentArticle.setAttribute('ID', currentNode.getAttribute('ID'))
			const lemma = document.createElement('lemma')
			lemma.textContent = content.slice(-1) === ',' ? content.slice(0, -1) : content

			if (content.slice(-1) === ',') {
				lemma.textContent = content.slice(0, -1)
				currentArticle.appendChild(lemma)
				currentArticle.appendChild(document.createTextNode(','))
			} else {
				lemma.textContent = content
				currentArticle.appendChild(lemma)

			}
		} else if (currentArticle != null) {
			if (content != null && content.length > 0) {
				const textNode = document.createTextNode(content)
				currentArticle.appendChild(textNode)
			} else if (currentNode.nodeName === 'SP') {
				const textNode = document.createTextNode(' ')
				currentArticle.appendChild(textNode)
			}
		}
	}
	if (currentArticle != null) fragment.appendChild(currentArticle)
	
	// const preparedLayer: TextLayer = {
	// 	element: fragment,
	// 	id: 'prepared',
	// 	type: LayerType.Text
	// }
	return fragment
}
