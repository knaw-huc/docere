import * as path from 'path'
import puppeteer from 'puppeteer'
import express from 'express'
import { Server } from 'http'

import { EsDataType } from '../../../common/src/enum'
import { getType, getProjectsSourceDir, readFileContents, getEntryIdFromFilePath, getXMLPath, isError, getElasticSearchDocument } from '../utils'
import { prepareAndExtract } from './prepare-and-extract'

const projects = require('esm')(module)(path.resolve(process.cwd(), './packages/projects')).default

import type { PrepareAndExtractOutput, DocereApiError, Mapping, MappingProperties } from '../types'
import type { DocereConfig } from '../../../common/src/types/config-data/config'

const port = 3334
/////
export default class Puppenv {
	private browser: puppeteer.Browser
	private server: Server
	private pages: Map<string, puppeteer.Page> = new Map()
	private configs: Map<string, DocereConfig> = new Map()

	constructor() {
		const app = express()
		app.disable('x-powered-by')
		app.use('/projects', express.static(getProjectsSourceDir().replace(/src$/, 'dist')))

		app.use(express.static(process.cwd()))

		app.get('/', (_req, res) => res.send(`<html><head></head><body><canvas></canvas></body></html>`))
		this.server = app.listen(port, () => console.log('Running express server for Puppeteer pages'))
	}

	async start() {
		this.browser = await puppeteer.launch({
			args: [
				'--no-sandbox',
				// '--disable-setuid-sandbox',
			]
		})

		console.log('Puppeteer launched')
	}

	async close() {
		await this.browser.close()
		this.server.close()
	}

	async prepareAndExtractFromFile(projectId: string, documentId: string) {
		const filePath = getXMLPath(projectId, documentId)

		let contents
		try {
			contents = readFileContents(filePath)
		} catch (err) {
			return { __error: `File '${documentId}.xml' for project '${projectId}' not found` }
		}

		return this.prepareAndExtract(contents, projectId, documentId)
	}
	async prepareAndExtract(xml: string, projectId: string, documentId?: string): Promise<PrepareAndExtractOutput | DocereApiError> {
		const page = await this.getPage(projectId)

		let result: PrepareAndExtractOutput | DocereApiError
		try {
			result = await page.evaluate(
				prepareAndExtract,
				xml,
				documentId,
				projectId,
			)
		} catch (err) {
			result = { __error: `Prepare and extract failed for '${documentId}' in '${projectId}'\n${JSON.stringify(err)}` }
		}

		return result
	}

	async getMapping(projectId: string, filePaths: string[]): Promise<Mapping | DocereApiError> {
		const properties: MappingProperties = {}
		const config = await this.getConfig(projectId)
		if (isError(config)) return config

		const selectedFileNames = filePaths.length > 20 ?
			[
				filePaths[0],
				filePaths[Math.floor(filePaths.length * .125)],
				filePaths[Math.floor(filePaths.length * .25)],
				filePaths[Math.floor(filePaths.length * .375)],
				filePaths[Math.floor(filePaths.length * .5)],
				filePaths[Math.floor(filePaths.length * .625)],
				filePaths[Math.floor(filePaths.length * .75)],
				filePaths[Math.floor(filePaths.length * .875)],
				filePaths[filePaths.length - 1]
			] :
			filePaths	

		const xmlContents = await Promise.all(selectedFileNames.map(fn => readFileContents(fn)))

		const fieldKeys = new Set<string>()
		for (const [i, xml] of xmlContents.entries()) {
			const entryId = getEntryIdFromFilePath(selectedFileNames[i], projectId)
			const prepareAndExtractOutput = await this.prepareAndExtract(xml, projectId, entryId)
			if (isError(prepareAndExtractOutput)) return prepareAndExtractOutput
			const [extractedEntry] = prepareAndExtractOutput
			const esDocument = getElasticSearchDocument(extractedEntry)
			Object.keys(esDocument).forEach(fieldKey => fieldKeys.add(fieldKey))
		}

		if (config.hasOwnProperty('metadata')) config.metadata.forEach(md => fieldKeys.add(md.id))
		if (config.hasOwnProperty('entities')) config.entities.forEach(td => fieldKeys.add(td.id))

		fieldKeys
			.forEach(key => {
				const type = getType(key, config)
				if (type != null) properties[key] = { type }
			})

		properties.text_suggest = {
			type: EsDataType.Completion,
			analyzer: "simple",
			preserve_separators: true,
			preserve_position_increments: true,
			max_input_length: 50,
		}

		return {
			mappings: { properties }
		}
	}

	async getConfig(projectId: string): Promise<DocereConfig | DocereApiError> {
		if (this.configs.has(projectId)) {
			return this.configs.get(projectId)
		}

		const error: DocereApiError = { code: 404, __error: `Config data not found. Does project '${projectId}' exist?` }
		let config: DocereConfig | DocereApiError
		try {
			const configImport = await projects[projectId].config
			config = configImport == null ? error : (await configImport()).default
		} catch (err) {
			console.log(err)
			config = error
		}

		if (!isError(config)) this.configs.set(projectId, config)
		else console.log(`Return ${projectId} config`)

		return config
	}


	async getPageConfig(projectId: string, pageId: string) {
		const config = await this.getConfig(projectId)
		if (isError(config)) return config

		// Flatten pages before using .find
		const pagesConfig = config.pages
			.reduce((prev, curr) => {
				if (Array.isArray(curr.children)) prev.push(...curr.children)
				prev.push(curr)
				return prev
			}, [])

		return pagesConfig.find(p => p.id === pageId)
	}


	private async getPage(projectId: string) {
		if (this.pages.has(projectId)) return this.pages.get(projectId)

		const page = await this.browser.newPage()
		page.on('console', (msg: any) => {
			msg = msg.text()
			console.log('From page: ', msg)
		})
		await page.goto(`http://localhost:${port}`)

		await page.addScriptTag({ path: path.resolve(process.cwd(), './packages/projects/dist/index.js') })
		await page.addScriptTag({ path: path.resolve(process.cwd(), './packages/api/build.puppenv.utils/bundle.js') })

		this.pages.set(projectId, page)	
		console.log(`Return ${projectId} page`)
		return page
	}
}
