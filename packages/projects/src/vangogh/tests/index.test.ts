import { SerializedEntry } from '@docere/common'
import { fetchEntry } from '../../../../tests/src/utils'
import { isSerializedTextLayer, isSerializedFacsimileLayer } from '@docere/common'

const projectId = 'vangogh'
const briefId = 'let886'

export function vangoghTests() {
	let brief: SerializedEntry

	beforeAll(async () => {
		brief = await fetchEntry(projectId, briefId)
	})

	it('Should have 3 layers', () => {
		expect(brief.layers).toHaveLength(3)
	})

	it('Should have a facsimile layer', () => {
		expect(brief.layers.filter(isSerializedFacsimileLayer)).toHaveLength(1)
	})

	it("Should have a filled 'original' text layers and undefined 'translation' layer", () => {
		const blayers = brief.layers.filter(isSerializedTextLayer)
		expect(blayers).toHaveLength(2)
		expect(blayers[0].id).toBe('original')
		expect(blayers[0].content).toHaveLength(5034)
		expect(blayers[1].id).toBe('translation')
		expect(blayers[1].content).toHaveLength(3141)
	})

	describe('Brief', () => {
		it(`Should have ID: ${briefId}`, () => {
			expect(brief.id).toBe(briefId)
		})

		it('Should be a letter from Willemien van Gogh', () => {
			expect(brief.content.slice(548, 597)).toBe('Willemien van Gogh. Auvers, Friday, 13 June 1890.')
		})

		it('Should have 3 layers', () => {
			expect(brief.layers).toHaveLength(3)
		})

		it('Should have 2 facsimiles per layer', () => {
			expect(brief.layers[0].facsimiles).toHaveLength(2)
			expect(brief.layers[1].facsimiles).toHaveLength(2)
			expect(brief.layers[2].facsimiles).toHaveLength(2)
		})

		it('Should have 5 notes', () => {
			const textLayer = brief.layers.find(isSerializedTextLayer)
			const entities = new Map(textLayer.entities)
			expect(entities.get('note')).toHaveLength(5)
		})
	})
}
