import React from 'react'

import type { DocereTextViewProps } from '.'

function unwrap(el: HTMLElement) {
	// move all children out of the element
	while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el)

	// remove the empty element
	el.parentNode.removeChild(el)
}

function removeCurrentHighlights(container: HTMLElement) {
	for (const mark of container.querySelectorAll('mark')) {
		unwrap(mark)
	}
}

function wrap(node: Text, index: number, found: string) {
	const textRange = document.createRange()
	textRange.setStart(node, index)
	textRange.setEnd(node, index + found.length)
	const el = document.createElement('mark')
	textRange.surroundContents(el)
	return el
}

export function highlightQueryInDomElement(container: HTMLElement, query: string | string[]) {
	console.log(container.outerHTML)	
	const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
	const map = new Map()

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
			const mark = wrap(currentNode, result.index - prevIndex - prevFoundLength, result[0])
			tops.push(mark.getBoundingClientRect().top)
			currentNode = currentNode.nextSibling.nextSibling
			prevIndex = result.index
			prevFoundLength = result[0].length
		}
	}

	return tops
}

export default function useHighlight(
	ref: React.RefObject<HTMLDivElement>,
	tree: React.ReactNode,
	highlight: DocereTextViewProps['highlight'],
	setHighlightAreas: (areas: number[]) => void
) {
	React.useEffect(() => {
		if (ref.current == null || highlight == null || highlight.length === 0) return

		removeCurrentHighlights(ref.current)
		const tops = highlightQueryInDomElement(ref.current, highlight)

		if (setHighlightAreas) setHighlightAreas(tops.filter((v, i, a) => v > 0 && a.indexOf(v) === i))
	}, [tree, highlight])
}
