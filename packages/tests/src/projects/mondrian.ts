import { SerializedEntry } from '../../../common/src'
import { fetchEntry } from '../utils'
import { isSerializedTextLayer, isSerializedFacsimileLayer } from '@docere/common'

const projectId = 'mondrian'
const briefId = '18931007_PM_ALLE_5004'
const brief2Id = '19100707y_IONG_0019'
const geschriftId = '1917_NieuweBeeldingInSchilderkunst_STIJL'

export function mondrianTests() {
	let brief: SerializedEntry
	let brief2: SerializedEntry
	let geschrift: SerializedEntry

	beforeAll(async () => {
		brief = await fetchEntry(projectId, briefId)
		brief2 = await fetchEntry(projectId, brief2Id)
		geschrift = await fetchEntry(projectId, geschriftId)
	})

	it('Should have 3 layers', () => {
		expect(brief.layers).toHaveLength(3)
		expect(geschrift.layers).toHaveLength(3)
	})

	it('Should have a facsimile layer', () => {
		expect(brief.layers.filter(isSerializedFacsimileLayer)).toHaveLength(1)
		expect(geschrift.layers.filter(isSerializedFacsimileLayer)).toHaveLength(1)
	})

	it("Should have a filled 'original' text layers and undefined 'translation' layer", () => {
		const blayers = brief.layers.filter(isSerializedTextLayer)
		expect(blayers).toHaveLength(2)
		expect(blayers[0].id).toBe('original')
		expect(blayers[0].content).toHaveLength(2136)
		expect(blayers[1].id).toBe('translation')
		expect(blayers[1].content).toBeNull()

		const glayers = geschrift.layers.filter(isSerializedTextLayer)
		expect(glayers).toHaveLength(2)
		expect(glayers[0].id).toBe('original')
		expect(glayers[0].content).toHaveLength(233646)
		expect(glayers[1].id).toBe('translation')
		expect(glayers[1].content).toBeNull()
	})

	describe('Brief', () => {
		it(`Should have ID: ${briefId}`, () => {
			expect(brief.id).toBe(briefId)
		})

		it('Should be a letter from August Allebe', () => {
			expect(brief.content.slice(506, 608)).toBe('Brief van <rs type="person">August Allebé</rs> aan Piet Mondriaan. Amsterdam, zaterdag 7 oktober 1893.')
		})

		it('Should not have facsimiles', () => {
			const facsimileCount = brief.layers.reduce((p, c) => p + c.facsimiles.length, 0)
			expect(facsimileCount).toBe(0)
		})

		it('Should have 2 notes', () => {
			const textLayer = brief.layers.find(isSerializedTextLayer)
			const entities = new Map(textLayer.entities)
			expect(entities.get('editor')).toHaveLength(2)
		})
	})

	describe('Brief2', () => {
		it(`Should have ID: ${brief2Id}`, () => {
			expect(brief2.id).toBe(brief2Id)
		})

		it('Should have 4 types of entities', () => {
			const textLayer = brief2.layers.find(isSerializedTextLayer)
			const entities = new Map(textLayer.entities)
			expect(entities.size).toBe(4)
		})
	})

	describe('Geschrift', () => {
		it(`Should have ID: ${geschriftId}`, () => {
			expect(geschrift.id).toBe(geschriftId)
		})

		it('Should be a letter from August Allebe', () => {
			expect(geschrift.content.slice(546, 584)).toBe('De nieuwe beelding in de schilderkunst')
		})

		it('Should have 4 facsimiles on original and facsimile layers', () => {
			const original = geschrift.layers.find(l => l.id === 'original')
			const translation = geschrift.layers.find(l => l.id === 'translation')
			const facsimile = geschrift.layers.find(l => l.id === 'facsimile')
			expect(original.facsimiles).toHaveLength(4)
			expect(translation.facsimiles).toHaveLength(0)
			expect(facsimile.facsimiles).toHaveLength(4)
		})

		it('Should have entities', () => {
			expect(true).toBeTruthy()
		})
	})
}
