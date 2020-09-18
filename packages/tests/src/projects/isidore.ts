import path from 'path'
import fs from 'fs'
import { PrepareAndExtractOutput } from '../../../api/src/types'
import type { ExtractedEntry } from '../../../common/src'
import { prepareAndExtract } from '../../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../../api/src/utils'

export function isidoreTests() {
	let output: PrepareAndExtractOutput
	let entry: ExtractedEntry
	let part4: ExtractedEntry

	beforeAll(async () => {
		const xml = fs.readFileSync(path.resolve(process.cwd(), '../projects/src/isidore/xml/Isidore.xml'), 'utf8')

		const result = await page.evaluate(
			prepareAndExtract,
			xml,
			'TestDocumentID',
			'isidore',
		)
		if (isError(result)) return;
		output = result
		entry = output[0]
		part4 = entry.parts[3]
	})

	it('should work', () => {
		expect(1).toBe(1)
	})
}
