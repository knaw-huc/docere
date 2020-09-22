import path from 'path'
import fs from 'fs'
import { SerializedEntry, isSerializedTextLayer } from '../../../common/src'
import { prepareAndExtract } from '../../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../../api/src/utils'

export function utrechtpsalterTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		const xml = fs.readFileSync(path.resolve(process.cwd(), '../projects/src/utrechtpsalter/xml/0132.xml'), 'utf8')

		const result = await page.evaluate(
			prepareAndExtract,
			xml,
			'0123',
			'utrechtpsalter',
		)
		if (isError(result)) return
		entry = result[0]
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(5)
		expect(entry.layers[0].id).toBe('facsimile')
		expect(entry.layers[0].type).toBe('facsimile')
		expect(entry.layers[1].id).toBe('la')
		expect(entry.layers[1].type).toBe('text')
		expect(entry.layers[2].id).toBe('nl')
		expect(entry.layers[2].type).toBe('text')
		expect(entry.layers[3].id).toBe('en')
		expect(entry.layers[3].type).toBe('text')
		expect(entry.layers[4].id).toBe('fr')
		expect(entry.layers[4].type).toBe('text')
	})

	it('Should have only "n" metadata', () => {
		expect(Object.keys(entry.metadata)).toHaveLength(1)
		expect(entry.metadata.n).toBe(123)
	})

	describe('Latin layer', () => {
		it('Should have title "Latin"', () => {
			const layer = entry.layers.filter(isSerializedTextLayer)[0]
			expect(layer.title).toBe('Latin')
		})

		it('Should be PSALM 106', () => {
			const layer = entry.layers.filter(isSerializedTextLayer)[0]
			expect(layer.content.slice(96, 105)).toBe('PSALM 106')
		})
	})
}
