import React from 'react'

import type { DocereTextViewProps } from '.'

function wrap(node: Text, index: number, found: string) {
	const textRange = document.createRange()
	textRange.setStart(node, index)
	textRange.setEnd(node, index + found.length)
	const el = document.createElement('mark')
	textRange.surroundContents(el)
	return el
}

export function highlightQueryInDomElement(element: HTMLElement, query: string | string[]) {
	const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
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

		const tops = highlightQueryInDomElement(ref.current, highlight)

		if (setHighlightAreas) setHighlightAreas(tops.filter((v, i, a) => v > 0 && a.indexOf(v) === i))
	}, [tree, highlight])
}
