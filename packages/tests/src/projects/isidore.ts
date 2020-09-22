import path from 'path'
import fs from 'fs'
import { PrepareAndExtractOutput } from '../../../api/src/types'
import type { SerializedEntry } from '../../../common/src'
import { prepareAndExtract } from '../../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../../api/src/utils'

export function isidoreTests() {
	let output: PrepareAndExtractOutput
	let entry: SerializedEntry
	let part4: SerializedEntry

	beforeAll(async () => {
		const xml = fs.readFileSync(path.resolve(process.cwd(), '../projects/src/isidore/xml/Isidore.xml'), 'utf8')

		const result = await page.evaluate(
			prepareAndExtract,
			xml,
			'TestDocumentID',
			'isidore',
		)
		if (isError(result)) return;
		output = result
		entry = output[0]
		part4 = entry.parts[3]
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(2)
		expect(entry.layers[0].id).toBe('facsimile')
		expect(entry.layers[0].type).toBe('facsimile')
		expect(entry.layers[1].id).toBe('text')
		expect(entry.layers[1].type).toBe('text')
	})

	it('Should have 6 facsimiles on the layers', () => {
		expect(entry.layers[0].facsimiles).toHaveLength(6)
	 	expect(entry.layers[1].facsimiles).toHaveLength(6)
	})

	it('Should have 9 entities on the layers', () => {
		expect(entry.layers[0].entities).toHaveLength(9)
		expect(entry.layers[1].entities).toHaveLength(9)
	})

	it('Should have 0 metadata', () => {
		expect(Object.keys(entry.metadata)).toHaveLength(0)
	})

	it('Should have 4 parts', () => {
		expect(entry.parts).toHaveLength(4)
	})

	describe('Part 4', () => {
		it('Should have ID: IV', () => {
			expect(part4.id).toBe('IV')
		})

		it('Should be DE LITTERIS LATINIS', () => {
			expect(part4.plainText.slice(11, 30)).toBe('DE LITTERIS LATINIS')
		})		

		it('Should have 2 layers', () => {
			expect(part4.layers).toHaveLength(2)
			expect(part4.layers[0].id).toBe('facsimile')
			expect(part4.layers[0].type).toBe('facsimile')
			expect(part4.layers[1].id).toBe('text')
			expect(part4.layers[1].type).toBe('text')
		})

		it('Should have 6 facsimiles', () => {
			expect(part4.layers[0].facsimiles).toHaveLength(6)
			expect(part4.layers[1].facsimiles).toHaveLength(6)
		})

		it('Should have 9 entities', () => {
			expect(part4.layers[0].entities).toHaveLength(9)
			expect(part4.layers[1].entities).toHaveLength(9)
		})
	})
}
