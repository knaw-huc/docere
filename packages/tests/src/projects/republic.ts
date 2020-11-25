import { SerializedEntry } from '../../../common/src'
import { fetchEntry } from '../utils'
// import { isSerializedFacsimileLayer } from '@docere/common'

const projectId = 'republic'
const documentId = 'meeting-1705-01-10-session-1'

export function republicTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry(projectId, documentId)
	})

	it(`Should have ID: ${documentId}`, () => {
		expect(entry.id).toBe(documentId)
	})

	it('Should have a column with a docere:id', () => {
		const expected = '<column coords="2703_2573_843_545" facs="NL-HaNA_1.01.02/3760/NL-HaNA_1.01.02_3760_0030.jpg" docere:id="NL-HaNA_1.01.02/3760/NL-HaNA_1.01.02_3760_0030.jpg" docere:type="facsimile">'
		expect(entry.content.slice(995, 995 + expected.length)).toBe(expected)
	})

	it('Should have metadata', () => {
		const invnum = entry.metadata.find(m => m.id === 'inventory_num')
		expect(invnum.value).toBe('3760')

		const date = entry.metadata.find(m => m.id === 'date')
		expect(date.value).toBe('1705-01-10')

		const mw = entry.metadata.find(m => m.id === 'meeting_weekday')
		expect(mw.value).toBe('Sabbathi')
	})

	// it(`Should have facs IDs: ${documentId}`, () => {
	// 	expect(entry.layers.find(isSerializedFacsimileLayer).facsimiles)
	// 		.toEqual(
	// 			[
	// 				"hca30-749/2/nl-hana_hca30-749_2_0029",
	// 				"hca30-749/2/nl-hana_hca30-749_2_0030",
	// 				"hca30-749/2/nl-hana_hca30-749_2_0031"
	// 			]
	// 		)
	// })

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
