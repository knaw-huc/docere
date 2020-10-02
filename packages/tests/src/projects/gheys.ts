import { SerializedEntry, isFacsimileLayer, isTextLayer, EsDataType } from '../../../common/src'
import { handleXml } from '../utils'

const projectId = 'gheys'
const documentId = 'NAN_disk1/7746/NL-HaNA_1.04.02_7746_0007'

export function gheysTests() {
	let entry: SerializedEntry

	beforeAll(async () => {
		entry = await handleXml(projectId, documentId)
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
		expect(entry.layers.filter(isFacsimileLayer)).toHaveLength(1)
	})

	it("Should have a filled 'original' text layers and undefined 'translation' layer", () => {
		const layers = entry.layers.filter(isTextLayer)
		expect(layers).toHaveLength(1)
		expect(layers[0].id).toBe('text')
		expect(layers[0].content).toHaveLength(19146)
	})

	it('Should be a letter from August Allebe', () => {
		expect(entry.content.slice(102, 173)).toBe('register batavia april secunen opperhoofd maij borssum gesz aprie princ')
	})

	it('Should have 1 facsimile on each layer', () => {
		expect(entry.layers[0].facsimiles).toHaveLength(1)
		expect(entry.layers[1].facsimiles).toHaveLength(1)
	})

	it('Should have 26 entities on each layer', () => {
		expect(entry.layers[0].entities).toHaveLength(26)
		expect(entry.layers[1].entities).toHaveLength(26)
	})

	it('Should have no notes', () => {
		expect(entry.layers[0].notes).toHaveLength(0)
		expect(entry.layers[1].notes).toHaveLength(0)
	})
}
