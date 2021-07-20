import { SerializedEntry } from '../../../common/src'
import { fetchEntry } from '../utils'
import { isSerializedFacsimileLayer } from '@docere/common'

const projectId = 'bosscheschepenprotocollen'
const documentId = 'r1661_100'

export function bosscheschepenprotocollenTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry(projectId, documentId)
	})

	it(`Should have ID: ${documentId}`, () => {
		expect(entry.id).toBe(documentId)
	})

	it(`Should have facs IDs: ${documentId}`, () => {
		expect(entry.layers.find(isSerializedFacsimileLayer).facsimiles)
			.toEqual([ '58v', '59r', '59v', '60r', '60v'])
	})
}
