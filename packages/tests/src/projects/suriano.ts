import path from 'path'
import fs from 'fs'
import 'expect-puppeteer'
import { prepareAndExtract } from '../../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../../api/src/utils'
import { isTextLayer, isFacsimileLayer } from '../../../common/src/utils'

import type { PrepareAndExtractOutput } from '../../../api/src/types'
import type { ExtractedEntry } from '../../../common/src'

export const surianoTests = () => {
	let output: PrepareAndExtractOutput
	let entry: ExtractedEntry
	let part4: ExtractedEntry

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

	it('Should have 119 notes', () => {
		expect(output[0].notes).toHaveLength(119)
	})

	it('Should have 86 facsimiles', () => {
		const textLayer = output[0].layers.find(isTextLayer)
		expect(textLayer.facsimiles).toHaveLength(86)

		const facsimileLayer = output[0].layers.find(isFacsimileLayer)
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
			expect(part4.text.slice(1, 6)).toBe('n. 46')
		})

		it('Should have 16 notes on the text layer', () => {
			expect(part4.layers[1].notes).toHaveLength(16)
		})

		it('Should have no notes on the facsimile layer', () => {
			expect(part4.layers[0].notes).toHaveLength(0)
		})
	})
}
