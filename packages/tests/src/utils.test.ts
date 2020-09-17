import path from 'path'
import fs from 'fs'
import 'expect-puppeteer'
import { prepareAndExtract } from '../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../api/src/utils'
import { isFacsimileLayer } from '../../common/src/utils'

import type { PrepareAndExtractOutput } from '../../api/src/types'
import type { ExtractedEntry } from '../../common/src'

describe('Projects', () => {
	describe('Suriano', () => {
		let output: PrepareAndExtractOutput
		let entry: ExtractedEntry
		let part4: ExtractedEntry

		beforeAll(async () => {
			const xml = fs.readFileSync(path.resolve(process.cwd(), '../projects/src/suriano/xml/suriano.xml'), 'utf8')

			await page.goto(`http://localhost:4444`)
			await page.addScriptTag({ path: path.resolve(process.cwd(), '../projects/dist/index.js') })
			await page.addScriptTag({ path: path.resolve(process.cwd(), '../api/build.puppenv.utils/bundle.js') })
			// page.on('console', (msg: any) => {
			// 	msg = msg.text()
			// 	console.log('From page: ', msg)
			// })

			const result = await page.evaluate(
				prepareAndExtract,
				xml,
				'TestDocumentID',
				'suriano',
			)
			if (isError(result)) return;
			output = result
			entry = output[0]
			part4 = entry.parts[3]
		})

		it('Should have 12 parts', () => {
			expect(output[0].parts).toHaveLength(12)
		})

		it('Should have 119 notes', () => {
			expect(output[0].notes).toHaveLength(119)
		})

		it('Should have 86 facsimiles', () => {
			const facsimileLayer = output[0].layers.find(isFacsimileLayer)
			expect(facsimileLayer.facsimiles).toHaveLength(86)
		})
	
		it('Should have 2 layers', () => {
			expect(output[0].layers).toHaveLength(2)
		})

		describe('Part 4', () => {
			it('Should be letter n. 46', () => {
				expect(part4.text.slice(1, 6)).toBe('n. 46')
			})

			it('Should have 16 notes', () => {
				expect(part4.notes).toHaveLength(16)
			})
		})
	})
})
