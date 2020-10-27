import { SerializedEntry } from '../../../common/src'
import { fetchEntry } from '../utils'
import { isFacsimileLayer } from '@docere/common'

const projectId = 'gekaaptebrieven'
const documentId = '1150'

export function gekaaptebrievenTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry(projectId, documentId)
	})

	it(`Should have ID: ${documentId}`, () => {
		expect(entry.id).toBe(documentId)
	})

	it(`Should have facs IDs: ${documentId}`, () => {
		expect(entry.layers.find(isFacsimileLayer).facsimiles.map(x => x.id))
			.toEqual(
				[
					"hca30-749/2/nl-hana_hca30-749_2_0029",
					"hca30-749/2/nl-hana_hca30-749_2_0030",
					"hca30-749/2/nl-hana_hca30-749_2_0031"
				]
			)
	})

	// it('Should have 7 metadata', () => {
	// 	expect(entry.metadata).toHaveLength(7)
	// })

	// it('Should have toegang metadata of type EsDataType.Hierarchy', () => {
	// 	expect(entry.metadata.find(md => md.id === 'toegang').datatype).toBe(EsDataType.Hierarchy)
	// })

	// it('Should have toegang metadata with title "Toegang"', () => {
	// 	expect(entry.metadata.find(md => md.id === 'toegang').title).toBe('"Toegang"')
	// })

	// it('Should have 2 layers', () => {
	// 	expect(entry.layers).toHaveLength(2)
	// })

	// it('Should have a facsimile layer', () => {
	// 	expect(entry.layers.filter(isFacsimileLayer)).toHaveLength(1)
	// })

	// it("Should have a filled 'original' text layers and undefined 'translation' layer", () => {
	// 	const layers = entry.layers.filter(isTextLayer)
	// 	expect(layers).toHaveLength(1)
	// 	expect(layers[0].id).toBe('text')
	// 	expect(layers[0].content).toHaveLength(21521)
	// })

	// it('Should be a letter with keywords', () => {
	// 	expect(entry.content.slice(102, 162)).toBe('brief papier edelen india agtb raad dtschip pacque edel sijd')
	// })

	// it('Should have 1 facsimile on each layer', () => {
	// 	expect(entry.layers[0].facsimiles).toHaveLength(1)
	// 	expect(entry.layers[1].facsimiles).toHaveLength(1)
	// })

	// it('Should have 73 entities on each layer', () => {
	// 	expect(entry.layers[0].entities).toHaveLength(73)
	// 	expect(entry.layers[1].entities).toHaveLength(73)
	// })

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
