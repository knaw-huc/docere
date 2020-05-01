import React from 'react'

import type { ComponentTree } from './types'
import type { DocereTextViewProps } from '.'

function wrap(node: Text, index: number, found: string) {
	const textRange = document.createRange()
	textRange.setStart(node, index)
	textRange.setEnd(node, index + found.length)
	const el = document.createElement('mark')
	textRange.surroundContents(el)
	return el
}

export default function useHighlight(
	ref: React.RefObject<HTMLDivElement>,
	componentTree: ComponentTree,
	highlight: DocereTextViewProps['highlight'],
	setHighlightAreas: (areas: number[]) => void
) {
	React.useEffect(() => {
		if (ref.current == null || highlight == null || highlight.length === 0) return

		const treeWalker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT)
		const map = new Map()

		if (Array.isArray(highlight)) highlight = highlight.join('|')
		const re = new RegExp(highlight, 'gui')

		const toppers: number[] = []

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
				toppers.push(mark.getBoundingClientRect().top)
				currentNode = currentNode.nextSibling.nextSibling
				prevIndex = result.index
				prevFoundLength = result[0].length
			}
		}

		setHighlightAreas(toppers.filter((v, i, a) => v > 0 && a.indexOf(v) === i))
	}, [componentTree, highlight])
}
