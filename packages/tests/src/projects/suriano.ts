import path from 'path'
import fs from 'fs'
import 'expect-puppeteer'
import { prepareAndExtract } from '../../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../../api/src/utils'
import { isSerializedTextLayer, isSerializedFacsimileLayer } from '../../../common/src/utils'

import type { PrepareAndExtractOutput } from '../../../api/src/types'
import type { SerializedEntry } from '../../../common/src'

export const surianoTests = () => {
	let output: PrepareAndExtractOutput
	let entry: SerializedEntry
	let part4: SerializedEntry

	beforeAll(async () => {
		const xml = fs.readFileSync(path.resolve(process.cwd(), '../projects/src/suriano/xml/suriano.xml'), 'utf8')

		const result = await page.evaluate(
			prepareAndExtract,
			xml,
			'TestDocumentID',
			'suriano',
		)
		if (isError(result)) return;
		output = result
		entry = output[0]
		part4 = entry.parts[3]
	})

	it('Should have 12 parts', () => {
		expect(output[0].parts).toHaveLength(12)
	})

	it('Should have 86 facsimiles', () => {
		const textLayer = output[0].layers.find(isSerializedTextLayer)
		expect(textLayer.facsimiles).toHaveLength(86)

		const facsimileLayer = output[0].layers.find(isSerializedFacsimileLayer)
		expect(facsimileLayer.facsimiles).toHaveLength(86)
	})

	it('Should have 2 layers', () => {
		expect(output[0].layers).toHaveLength(2)
	})

	describe('Part 4', () => {
		it('Should have ID: part4', () => {
			expect(part4.id).toBe('part4')
		})

		it('Should be letter n. 46', () => {
			expect(part4.plainText.slice(1, 6)).toBe('n. 46')
		})

		describe('Layers', () => {
			it('Should have 16 notes on the text layer', () => {
				expect(part4.layers[1].notes).toHaveLength(16)
			})

			it('Should have content in the first note', () => {
				expect(part4.layers[1].notes[0].content.slice(0, 184)).toBe('<li xmlns="http://www.w3.org/1999/xhtml" id="fn10" role="doc-endnote"><p><span class="span1"><sup xmlns="http://www.w3.org/1999/xhtml"><a href="#section0002.xhtml#calledF2">a</a></sup>')
			})

			it('Should have no notes on the facsimile layer', () => {
				expect(part4.layers[0].notes).toHaveLength(0)
			})

			it('Should have facsimile 145r as the first facsimile on the text layer', () => {
				expect(part4.layers[0].facsimiles[0].id).toBe('145r')
			})
		})

	})
}
