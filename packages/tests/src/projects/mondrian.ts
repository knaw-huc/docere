import fetch from 'node-fetch'
import { SerializedEntry, isFacsimileLayer, isTextLayer } from '../../../common/src'
import { prepareAndExtract } from '../../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../../api/src/utils'

const projectId = 'mondrian'
const documentId = 'brieven/18931007_PM_ALLE_5004'
// const documentId = 'brieven/18920227_HMKR_0001'
export function mondrianTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		const fetchResult = await fetch(`http://localhost/api/projects/${projectId}/xml/${encodeURIComponent(documentId)}`)
		const xml = await fetchResult.text()

		const result = await page.evaluate(
			prepareAndExtract,
			xml,
			documentId,
			projectId,
		)
		if (isError(result)) return
		entry = result[0]
	})

	it(`Should have ID: ${documentId}`, () => {
		expect(entry.id).toBe(documentId)
	})

	it('Should be a letter from August Allebe', () => {
		expect(entry.content.slice(183, 262)).toBe('Brief van August Allebé aan Piet Mondriaan. Amsterdam, zaterdag 7 oktober 1893.')
	})

	it('Should have 2 layers', () => {
		expect(entry.layers).toHaveLength(2)
	})

	it('Should not have a facsimile layer', () => {
		expect(entry.layers.filter(isFacsimileLayer)).toHaveLength(0)
	})

	it('Should have two text layers', () => {
		expect(entry.layers.filter(isTextLayer)).toHaveLength(2)
		expect(entry.layers[0].id).toBe('original')
		expect(entry.layers[1].id).toBe('translation')
	})

	it("Should have a filled 'original' text layers and undefined 'translation' layer", () => {
		const layers = entry.layers.filter(isTextLayer)
		expect(layers[0].content).toHaveLength(1994)
		expect(layers[1].content).toBeUndefined()
	})

	// it('Should have two text layers', () => {
	// 	expect(entry.layers[0].facsimiles).toHaveLength(4)
	// 	expect(entry.layers[1].facsimiles).toHaveLength(6)
	// })
}
