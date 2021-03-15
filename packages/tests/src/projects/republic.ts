// import { SerializedEntry } from '../../../common/src'
// import { fetchEntry } from '../utils'
// // import { isSerializedFacsimileLayer } from '@docere/common'

// const projectId = 'republic'
// const documentId = 'meeting-1705-01-10-session-1'

// export function republicTests() {
// 	let entry: SerializedEntry

// 	beforeAll(async () => {
// 		entry = await fetchEntry(projectId, documentId)
// 	})

// 	it(`Should have ID: ${documentId}`, () => {
// 		expect(entry.id).toBe(documentId)
// 	})

// 	it('Should have a column with a docere:id', () => {
// 		const expected = '<column coords="2703_2573_843_545" facs="NL-HaNA_1.01.02/3760/NL-HaNA_1.01.02_3760_0030.jpg" docere:id="NL-HaNA_1.01.02_3760_0030" docere:type="facsimile">'
// 		expect(entry.content.slice(995, 995 + expected.length)).toBe(expected)
// 	})

// 	it('Should have metadata', () => {
// 		const invnum = entry.metadata.find(m => m.id === 'inventory_num')
// 		expect(invnum.value).toBe('3760')

// 		const date = entry.metadata.find(m => m.id === 'date')
// 		expect(date.value).toBe('1705-01-10')

// 		const mw = entry.metadata.find(m => m.id === 'meeting_weekday')
// 		expect(mw.value).toBe('Sabbathi')
// 	})
// }
