import path from 'path'
import { surianoTests } from './suriano'
import { isidoreTests } from './isidore'
import { utrechtpsalterTests } from './utrechtpsalter'
import { mondrianTests } from './mondrian'
import { gheysTests } from './gheys'

describe('Projects', () => {
	beforeAll(async () => {
		await page.goto(`http://localhost:4444`)
		await page.addScriptTag({ path: path.resolve(process.cwd(), '../api/build.puppenv.data/utils.js') })
		await page.addScriptTag({ path: path.resolve(process.cwd(), '../api/build.puppenv.data/projects.js') })
		page.on('console', (msg: any) => {
			msg = msg.text()
			console.log('From page: ', msg)
		})
	})

	describe('Gheys', gheysTests)
	describe('Isidore', isidoreTests)
	describe('Mondrian', mondrianTests)
	describe('Suriano', surianoTests)
	describe('Utrecht psalter', utrechtpsalterTests)
})
