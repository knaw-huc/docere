import fetch from 'node-fetch'
import chalk from 'chalk'
import { logError } from '../utils'

/**

# Running tests
`$ npx ts-node test.ts` 

*/

const baseUrl = 'http://localhost:3000/'

async function checkGet(
	url: string,
	test: (response: any) => boolean
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

	if (test(json))
		console.log(chalk.green('Pass'))
	else
		console.log(chalk.red('Fail'), JSON.stringify(json));
}

async function main() {
	checkGet(
		`${baseUrl}projects`,
		projects => projects.length > 0
	) 

	checkGet(
		`${baseUrl}projects/gheys/config`,
		config => config.hasOwnProperty('config')
	)

	checkGet(
		`${baseUrl}projects/gheys/documents/${encodeURIComponent('NHA_1617/1780/NL-HlmNHA_1617_1780_0001')}`,
		fields =>
			fields.hasOwnProperty('facsimiles') &&
			fields.hasOwnProperty('id') &&
			fields.hasOwnProperty('text') &&
			fields.hasOwnProperty('metadata') &&
			fields.hasOwnProperty('entities') &&
			!fields.hasOwnProperty('text_suggest')
	)

	checkGet(
		`${baseUrl}projects/gheys/documents/${encodeURIComponent('NHA_1617/1780/NL-HlmNHA_1617_1780_0001')}/fields`,
		fields =>
			fields.hasOwnProperty('facsimiles') &&
			fields.hasOwnProperty('id') &&
			fields.hasOwnProperty('text') &&
			fields.hasOwnProperty('text_suggest') &&
			!fields.hasOwnProperty('metadata') &&
			!fields.hasOwnProperty('entities')
	)

	checkGet(
		`${baseUrl}projects/gheys/mapping`,
		mapping =>
			mapping.hasOwnProperty('mappings') && mapping.mappings.hasOwnProperty('properties') &&
			mapping.mappings.properties.hasOwnProperty('id') &&
			mapping.mappings.properties.id.hasOwnProperty('type') &&
			mapping.mappings.properties.id.type === 'keyword'
	)
}

main()
