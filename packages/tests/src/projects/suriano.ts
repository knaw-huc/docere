import 'expect-puppeteer'
import { isSerializedTextLayer, isSerializedFacsimileLayer } from '../../../common/src/utils'

import type { SerializedEntry } from '../../../common/src'
import { fetchEntry } from '../utils'

const entryId = 'Filza_2_1_Flavia_71r_103v_letter1'

export const surianoTests = () => {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry('suriano', entryId)
	})

	it('Should exist', () => {
		expect(entry).not.toBeNull()
	})

	it('Should have the correct ID', () => {
		expect(entry.id).toBe(entryId)
	})

	it('Should have 8 facsimiles', () => {
		const textLayer = entry.layers.find(isSerializedTextLayer)
		expect(textLayer.facsimiles).toHaveLength(8)

		const facsimileLayer = entry.layers.find(isSerializedFacsimileLayer)
		expect(facsimileLayer.facsimiles).toHaveLength(8)
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(2)
	})

	it('Should have 2 entities', () => {
		expect(entry.textData.entities).toHaveLength(32)
	})

	// describe('Part 4', () => {
	// 	it('Should have ID: part4', () => {
	// 		expect(part4.id).toBe('part4')
	// 	})

	// 	it('Should be letter n. 46', () => {
	// 		expect(part4.plainText.slice(1, 6)).toBe('n. 46')
	// 	})

	// 	describe('Metadata', () => {
	// 		it('Should have length 2', () => {
	// 			expect(part4.metadata).toHaveLength(2)
	// 		})
	// 		it('Should have a parent on metadata', () => {
	// 			expect(part4.metadata.find(md => md.id === 'parent')?.value).toBe('suriano')
	// 		})

	// 		it('Should have a order number on metadata', () => {
	// 			expect(part4.metadata.find(md => md.id === 'n')?.value).toBe(4)
	// 		})
	// 	})

	// 	describe('Layers', () => {
	// 		it('Should have 16 notes on the text layer', () => {
	// 			const notes = part4.textData.entities.filter(([_id, e]) => e.type === EntityType.Note)
	// 			expect(notes).toHaveLength(16)
	// 			expect(notes[0][1].content.slice(0, 184)).toBe('<li xmlns="http://www.w3.org/1999/xhtml" id="fn10" role="doc-endnote"><p><span class="span1"><sup xmlns="http://www.w3.org/1999/xhtml"><a href="#section0002.xhtml#calledF2">a</a></sup>')
	// 		})

	// 		// it('Should have no notes on the facsimile layer', () => {
	// 		// 	const notes = part4.layers[0].entities.filter(e => e.type === EntityType.Note)
	// 		// 	expect(notes).toHaveLength(0)
	// 		// })

	// 		// it('Should have facsimile 145r as the first facsimile on the text layer', () => {
	// 		// 	expect(part4.layers[0].facsimiles[0].id).toBe('145r')
	// 		// })
	// 	})
	// })
}
