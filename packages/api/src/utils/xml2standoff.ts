import sax from 'sax'

import { extendStandoffAnnotation, Standoff, StandoffAnnotation } from '@docere/common'

const strict = true
const parser = sax.parser(strict)

export function xml2standoff(content: string): Promise<Standoff> {
	let offset = 0
	let text = ''
	const annotations: StandoffAnnotation[] = []
	const stack: StandoffAnnotation[] = []

	// Keep the order per offset, to be able to reconstruct the XML. The original order
	// is lost when sorting on offset only, because of the Array.sort algorithm
	const orderByOffset: Map<number, number> = new Map()
	function updateOrderByOffset() {
		if (orderByOffset.has(offset)) {
			orderByOffset.set(offset, orderByOffset.get(offset) + 1)
		}
		else orderByOffset.set(offset, 0)
	}

	// parser.onprocessinginstruction = x => {}
	// parser.ondoctype = x => {}
	// parser.oncomment = x => {}

	parser.ontext = t => {
		t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		offset += t.length
		text += t
	}

	parser.onopentag = node => {
		updateOrderByOffset()

		const annotation: StandoffAnnotation = extendStandoffAnnotation({
			metadata: node.attributes as Record<string, string>,
			isSelfClosing: node.isSelfClosing,
			name: node.name,
			start: offset,
			startOrder: orderByOffset.get(offset),
		})

		stack.push(annotation)
	}

	parser.onclosetag = nodeName => {
		updateOrderByOffset()

		const annotation = stack.pop()
		if (annotation.name !== nodeName) console.error('NODE NAME NOT EQUAL')
		annotation.end = offset
		annotation.endOrder = orderByOffset.get(offset)
		annotations.push(annotation)
	}

	return new Promise((resolve, reject) => {
		if (!content.trim().length) reject()

		parser.onerror = () => reject()

		parser.onend = function () {
			resolve({
				annotations: annotations
					.sort((a, b) => {
						if (a.start < b.start) return -1
						if (a.start > b.start) return 1
						if (a.startOrder < b.startOrder) return -1
						if (a.startOrder > b.startOrder) return 1
						return 0
					}),
				metadata: {},
				text,
			})
		}

		parser.write(content).close()
	})
}
