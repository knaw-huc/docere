import type { SerializedEntry } from '../../../common/src'
import { handleXml } from '../utils'

export function isidoreTests() {
	let entry: SerializedEntry
	let part4: SerializedEntry

	beforeAll(async () => {
		entry = await handleXml('isidore', 'Isidore')
		part4 = entry.parts[3]
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(2)
		expect(entry.layers[0].id).toBe('facsimile')
		expect(entry.layers[0].type).toBe('facsimile')
		expect(entry.layers[1].id).toBe('text')
		expect(entry.layers[1].type).toBe('text')
	})

	it('Should have 241 facsimiles on the layers', () => {
		expect(entry.layers[0].facsimiles).toHaveLength(241)
	 	expect(entry.layers[1].facsimiles).toHaveLength(241)
	})

	it('Should have 49 entities on the layers', () => {
		expect(entry.layers[0].entities).toHaveLength(49)
		expect(entry.layers[1].entities).toHaveLength(49)
	})

	it('Should have 0 metadata', () => {
		expect(Object.keys(entry.metadata)).toHaveLength(0)
	})

	it('Should have 4 parts', () => {
		expect(entry.parts).toHaveLength(37)
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

		it('Should have 241 facsimiles', () => {
			expect(part4.layers[0].facsimiles).toHaveLength(241)
			expect(part4.layers[1].facsimiles).toHaveLength(241)
		})

		it('Should have 49 entities', () => {
			expect(part4.layers[0].entities).toHaveLength(49)
			expect(part4.layers[1].entities).toHaveLength(49)
		})
	})
}
