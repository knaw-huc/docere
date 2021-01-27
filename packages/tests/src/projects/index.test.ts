import { DTAP } from '../../../common/src'
import path from 'path'
import { dtapMap } from '../../../projects/src/dtap'

import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

/**
 * Convert environment variable to DTAP number. This doesn't
 * validate so we ignore the TS error
 */
// @ts-ignore
const DOCERE_DTAP: DTAP = DTAP[process.env.DOCERE_DTAP]


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

	/**
	 * Loop through the dtapMap establised in @docere/projects
	 */
	for (const projectId of Object.keys(dtapMap)) {
		/**
		 * Only test the projects where DTAP is equal to DOCERE_DTAP.
		 * So if DOCERE_DTAP=Acceptance, only the projects which are
		 * on the acceptance server, but not on the production server,
		 * are being tested. If DOCERE_DTAP is undefined, test everything
		 */ 
		if (DOCERE_DTAP != null && dtapMap[projectId] !== DOCERE_DTAP) continue

		/**
		 * Use a try catch, because a project could have no tests,
		 * or should it than fail? TODO
		 */
		try {
			const testsPath = path.resolve(process.cwd(), `../projects/src/${projectId}/tests/index.test.ts`)
			const x = require(testsPath)
			describe(projectId, x[`${projectId}Tests`])
		} catch (err) {
			console.log(`No tests found for project: "${projectId}"`)	
		}
	}
})
