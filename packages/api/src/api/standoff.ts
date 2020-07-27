// import fs from 'fs'
import sax, { QualifiedAttribute } from 'sax'
import { getXMLPath, readFileContents } from '../utils'

interface Annotation {
	attributes: Record<string, string> | Record<string, QualifiedAttribute>
	end: number
	endOrder: number
	isSelfClosing: boolean
	name: string
	start: number
	startOrder: number
}

interface Standoff {
	annotations: Annotation[]
	text: string
}

const strict = true
const parser = sax.parser(strict)
 
export function xmlToStandoff(projectId: string, documentId: string): Promise<Standoff> {
	let offset = 0
	let text = ''
	const annotations: Annotation[] = []
	const stack: Annotation[] = []

	const filePath = getXMLPath(projectId, documentId)
	const xml = readFileContents(filePath)

	// Keep the order per offset, to be able to reconstruct the XML. The original order
	// is lost when sorting on offset only, because of the Array.sort algorithm 
	const orderByOffset: Map<number, number> = new Map()
	function updateOrderByOffset() {
		if (orderByOffset.has(offset)) orderByOffset.set(offset, orderByOffset.get(offset) + 1)
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

		const annotation: Annotation = {
			attributes: node.attributes,
			end: null,
			endOrder: null,
			isSelfClosing: node.isSelfClosing,
			name: node.name,
			start: offset,
			startOrder: orderByOffset.get(offset),
		}

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
		parser.onerror = reject

		parser.onend = function () {
			resolve({ text, annotations })
		}
		
		parser.write(xml).close()
	})
}

function attributesToString(attributes: Annotation['attributes']) {
	if (!Object.keys(attributes).length) return ''
	return Object.keys(attributes).reduce((prev, curr) => {
		return `${prev} ${curr}="${attributes[curr]}"`
	}, '')
}

interface Tmp {
	opening: boolean
	tag: string
	offset: number
	order: number
}
export function standoffToXml(standoff: Standoff) {
	return standoff.annotations
		.reduce((prev, curr) => {
			const attributes = attributesToString(curr.attributes)
			const close = curr.isSelfClosing ? '/' : ''

			prev.push({
				offset: curr.start,
				opening: true,
				order: curr.startOrder,
				tag: `<${curr.name}${attributes}${close}>`,
			})

			if (!curr.isSelfClosing) {
				prev.push({
					order: curr.endOrder,
					offset: curr.end,
					opening: false,
					tag: `</${curr.name}>`,
				})
			}

			return prev
		}, [] as Tmp[])
		.sort((a, b) => {
			if (a.offset > b.offset) return 1
			if (a.offset < b.offset) return -1
			return a.order - b.order
		})
		.reduce((prev, curr, index, array) => {
			prev += curr.tag

			const nextTmp = (index < array.length) ? array[index + 1] : null
			if (nextTmp != null) {
				if (curr.offset < nextTmp.offset) {
					prev += standoff.text.slice(curr.offset, nextTmp.offset)
				}
			}

			return prev
		}, '')
}

// export async function main(projectId: string, documentId: string) {
// 	const standoff = await xmlToStandoff(projectId, documentId)
// 	return standoff
// 	// const xml = standoffToXml(standoff)
// 	// fs.writeFileSync('tmp.xml', xml)
// }

// main('vangogh', 'RM25')
