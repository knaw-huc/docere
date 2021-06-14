import { SerializedEntry } from '@docere/common'
import { fetchEntry } from '../../../../tests/src/utils'

const projectId = 'republic'
const documentId = 'session-1728-01-28-num-1'

export function republicTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await fetchEntry(projectId, documentId)
	})

	it(`Should have ID: ${documentId}`, () => {
		expect(entry.id).toBe(documentId)
	})

	it('Should have metadata', () => {
		expect(entry.metadata.find(m => m.id === 'inventory_num').value).toBe('3783')
		expect(entry.metadata.find(m => m.id === 'date').value).toBe('1728-01-28')
		expect(entry.metadata.find(m => m.id === 'session_weekday').value).toBe('Mercurii')
		expect(entry.metadata.find(m => m.id === 'president').value).toBe('re Han Haar[olte.')
	})
}
