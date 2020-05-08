import fetch from 'node-fetch'
import chalk from 'chalk'
import { logError } from '../utils'

/**

# Running tests
`$ npx ts-node test.ts` 

*/

const baseUrl = 'http://localhost:3000/'

async function testGet(
	url: string,
	testFunction: (payload: any) => boolean
) {
	let response: any
	try {
		response = await fetch(url)
	} catch (err) {
		logError('Failed to fetch', url, err)
		return
	}

	if (response.status < 200 || response.status > 299) {
		const error = await response.text()
		logError(response.status, error, url)
		return
	}

	const json = await response.json()
	logTestResult(testFunction(json), JSON.stringify(json))
}

function logTestResult(success: boolean, errorMessage: string = '') {
	if (success)	console.log(chalk.green('Pass'))
	else			console.log(chalk.red('Fail'), errorMessage);
}

async function main() {
	testGet(
		`${baseUrl}projects`,
		projects => projects.length > 0
	) 

	testGet(
		`${baseUrl}projects/gheys/config`,
		config => config.hasOwnProperty('config')
	)

	testGet(
		`${baseUrl}projects/gheys/documents/${encodeURIComponent('NHA_1617/1780/NL-HlmNHA_1617_1780_0001')}`,
		fields =>
			fields.hasOwnProperty('facsimiles') &&
			fields.hasOwnProperty('id') &&
			fields.hasOwnProperty('text') &&
			fields.hasOwnProperty('metadata') &&
			fields.hasOwnProperty('entities') &&
			!fields.hasOwnProperty('text_suggest')
	)

	testGet(
		`${baseUrl}projects/gheys/documents/${encodeURIComponent('NHA_1617/1780/NL-HlmNHA_1617_1780_0001')}/fields`,
		fields =>
			fields.hasOwnProperty('facsimiles') &&
			fields.hasOwnProperty('id') &&
			fields.hasOwnProperty('text') &&
			fields.hasOwnProperty('text_suggest') &&
			!fields.hasOwnProperty('metadata') &&
			!fields.hasOwnProperty('entities')
	)

	testGet(
		`${baseUrl}projects/gheys/mapping`,
		mapping =>
			mapping.hasOwnProperty('mappings') && mapping.mappings.hasOwnProperty('properties') &&
			mapping.mappings.properties.hasOwnProperty('id') &&
			mapping.mappings.properties.id.hasOwnProperty('type') &&
			mapping.mappings.properties.id.type === 'keyword'
	)
}

main()
