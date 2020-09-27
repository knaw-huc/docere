import path from 'path'
import { surianoTests } from './suriano'
import { isidoreTests } from './isidore'
import { utrechtpsalterTests } from './utrechtpsalter'
import { mondrianTests } from './mondrian'

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

	describe('Isidore', isidoreTests)
	describe('Mondrian', mondrianTests)
	describe('Suriano', surianoTests)
	describe('Utrecht psalter', utrechtpsalterTests)
})
