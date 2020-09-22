import path from 'path'
import { surianoTests } from './suriano'
import { isidoreTests } from './isidore'
import { utrechtpsalterTests } from './utrechtpsalter'

describe('Projects', () => {
	beforeAll(async () => {
		await page.goto(`http://localhost:4444`)
		await page.addScriptTag({ path: path.resolve(process.cwd(), '../projects/dist/index.js') })
		await page.addScriptTag({ path: path.resolve(process.cwd(), '../api/build.puppenv.utils/bundle.js') })
		page.on('console', (msg: any) => {
			msg = msg.text()
			console.log('From page: ', msg)
		})
	})

	describe('Suriano', surianoTests)
	describe('Isidore', isidoreTests)
	describe('Utrecht psalter', utrechtpsalterTests)
})
