import { SerializedEntry, EsDataType } from '../../../common/src'
import { fetchEntry, fetchMapping } from '../utils'
import { Mapping } from '../../../api/src/types'
import { isSerializedFacsimileLayer, isSerializedTextLayer } from '@docere/common'

const projectId = 'gheys'
// const documentId = 'NAN_disk1/7746/NL-HaNA_1.04.02_7746_0007'
const documentId = 'NAN_disk2/8749/NL-HaNA_1.04.02_8749_0011'

export function gheysTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry(projectId, documentId)
	})

	describe('Gheys mapping', () => {
		let mapping: Mapping

		beforeAll(async () => {
			mapping = await fetchMapping(projectId)
		})

		it('Should have mappings and properties', () => {
			expect(mapping).toHaveProperty('mappings')
			expect(mapping.mappings).toHaveProperty('properties')
		})

		it('Should have hierarchy metadata "toegang"', () => {
			expect(mapping.mappings.properties).toHaveProperty('toegang_level0')
			expect(mapping.mappings.properties).toHaveProperty('toegang_level1')
			expect(mapping.mappings.properties).toHaveProperty('toegang_level2')
			expect(mapping.mappings.properties).toHaveProperty('toegang_level3')
			expect(mapping.mappings.properties).not.toHaveProperty('toegang_level4')
		})

		it('Should have integer metadata', () => {
			expect(mapping.mappings.properties.blocks.type).toBe('integer')
			expect(mapping.mappings.properties.chars.type).toBe('integer')
			expect(mapping.mappings.properties.n.type).toBe('integer')
		})

		it('Should have boolean metadata', () => {
			expect(mapping.mappings.properties.has_date.type).toBe('boolean')
		})

		it('Should have date metadata', () => {
			expect(mapping.mappings.properties.normalised_dates.type).toBe('date')
		})
	})

	it(`Should have ID: ${documentId}`, () => {
		expect(entry.id).toBe(documentId)
	})

	it('Should have 7 metadata', () => {
		expect(entry.metadata).toHaveLength(7)
	})

	it('Should have toegang metadata of type EsDataType.Hierarchy', () => {
		expect(entry.metadata.find(md => md.id === 'toegang').datatype).toBe(EsDataType.Hierarchy)
	})

	it('Should have toegang metadata with title "Toegang"', () => {
		expect(entry.metadata.find(md => md.id === 'toegang').title).toBe('"Toegang"')
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(2)
	})

	it('Should have a facsimile layer', () => {
		expect(entry.layers.filter(isSerializedFacsimileLayer)).toHaveLength(1)
	})

	it("Should have a filled 'original' text layers and undefined 'translation' layer", () => {
		const layers = entry.layers.filter(isSerializedTextLayer)
		expect(layers).toHaveLength(1)
		expect(layers[0].id).toBe('text')
		expect(layers[0].content).toHaveLength(21521)
	})

	it('Should be a letter with keywords', () => {
		expect(entry.content.slice(102, 162)).toBe('brief papier edelen india agtb raad dtschip pacque edel sijd')
	})

	it('Should have 1 facsimile on each layer', () => {
		expect(entry.layers[0].facsimiles).toHaveLength(1)
		expect(entry.layers[1].facsimiles).toHaveLength(1)
	})

	it('Should have 73 entities on each layer', () => {
		expect(entry.layers[0].entities).toHaveLength(73)
		expect(entry.layers[1].entities).toHaveLength(73)
	})

	// it('Should have 45 suggestions on each layer', () => {
	// 	const suggestions = entry.layers[0].entities.filter(e => e.configId === 'suggestion')
	// 	expect(suggestions).toHaveLength(45)
	// 	expect(suggestions[0].color).toBe(Colors.Red)
	// })

	// it('Should have 21 persons, 1 location, 2 jobs and 4 goods', () => {
	// 	const entities = entry.layers[0].entities
	// 	expect(entities.filter(e => e.configId === 'person')).toHaveLength(21)
	// 	expect(entities.filter(e => e.configId === 'location')).toHaveLength(1)
	// 	expect(entities.filter(e => e.configId === 'job')).toHaveLength(2)
	// 	expect(entities.filter(e => e.configId === 'good')).toHaveLength(4)
	// })

	// it('Should have orange color on location config', () => {
	// 	const entities = entry.layers[0].entities.filter(e => e.configId === 'location')
	// 	expect(entities[0].color).toBe(Colors.Orange)

	// })
}
