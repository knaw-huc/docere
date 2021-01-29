import 'expect-puppeteer'
import { isSerializedTextLayer, isSerializedFacsimileLayer } from '@docere/common'

import { fetchEntry } from '../../../../tests/src/utils'

import type { SerializedEntry } from '@docere/common'

const entryId = 'Filza_2_1_Flavia_71r_103v_letter1'
const filePath = `suriano/letters/${entryId}.xml`


export function surianoTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry('suriano', entryId, filePath)
	})

	it('Should exist', () => {
		expect(entry).not.toBeNull()
	})

	it('Should have the correct ID', () => {
		expect(entry.id).toBe(entryId)
	})

	it('Should have a summary in the metadata', () => {
		const summaryMetadata = entry.metadata.find(x => x.id === 'summary')
		expect(summaryMetadata).not.toBeNull()
	})

	it('Should have 8 facsimiles', () => {
		const textLayer = entry.layers.find(isSerializedTextLayer)
		expect(textLayer.facsimiles).toHaveLength(8)

		const facsimileLayer = entry.layers.find(isSerializedFacsimileLayer)
		expect(facsimileLayer.facsimiles).toHaveLength(8)
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(3)
	})

	it('Should have 2 entities', () => {
		expect(entry.textData.entities).toHaveLength(32)
	})
}
