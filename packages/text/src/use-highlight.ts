// import React from 'react'

import type { DocereTextViewProps } from '.'

export const MARK_TAG_NAME = 'mark'

function unwrap(el: HTMLElement) {
	// move all children out of the element
	while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el)

	// remove the empty element
	el.parentNode.removeChild(el)
}

function removeCurrentHighlights(container: Element) {
	for (const mark of container.querySelectorAll('mark')) {
		unwrap(mark)
	}
}

function wrap(node: Text, index: number, found: string) {
	const textRange = document.createRange()
	textRange.setStart(node, index)
	textRange.setEnd(node, index + found.length)
	const el = document.createElement(MARK_TAG_NAME)
	textRange.surroundContents(el)
	return el
}

export function highlightQueryInDomElement(container: Element, query: string | string[]) {
	// Create a tree walker which iterates over every text node
	const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)

	// Create a map of text nodes which match the query
	const map = new Map<Node, RegExpMatchArray[]>()

	if (Array.isArray(query)) query = query.join('|')
	const re = new RegExp(query, 'gui')
	
	// Collection of top offsets from <mark>s
	const tops: number[] = []

	while (treeWalker.nextNode()) {
		let result: RegExpMatchArray
		const indices: RegExpMatchArray[] = []
		while (result = re.exec(treeWalker.currentNode.textContent)) indices.push(result)
		if (indices.length) map.set(treeWalker.currentNode, indices)
	}

	for (const [node, indices] of map.entries()) {
		let currentNode = node
		let prevIndex = 0
		let prevFoundLength = 0
		for (const result of indices) {
			const mark = wrap(currentNode as Text, result.index - prevIndex - prevFoundLength, result[0])
			tops.push(mark.getBoundingClientRect().top)
			currentNode = currentNode.nextSibling.nextSibling
			prevIndex = result.index
			prevFoundLength = result[0].length
		}
	}

	return tops
}

export function highlightNode(
	el: Element,
	highlight: DocereTextViewProps['highlight'],
	setHighlightAreas: (areas: number[]) => void
) {
	if (el == null || highlight == null || highlight.length === 0) return el

	el = el.cloneNode(true) as Element

	removeCurrentHighlights(el)
	const tops = highlightQueryInDomElement(el, highlight)

	if (setHighlightAreas) setHighlightAreas(tops.filter((v, i, a) => v > 0 && a.indexOf(v) === i))

	return el
}
