import * as path from 'path'
import * as fs from 'fs'
import { Response as ExpressResponse } from 'express'
import chalk from 'chalk'
import { EsDataType, PageConfig } from '@docere/common'

import type { DocereApiError } from './types'
import type { DocereConfig, ElasticSearchDocument, MetadataItem, SerializedEntry } from '@docere/common'
// import { createLookup } from '../../common/src/types/entry'

// const projects = require('esm')(module)(path.resolve(process.cwd(), './packages/projects')).default
import projects from '@docere/projects'

export function getProjectsSourceDir() {
	// The current working dir is api/, the projects/ dir shares the same parent as api/
	return path.resolve(process.cwd(), `./packages/projects/src`)
}

export function getProjectSourceDir(projectId: string) {
	return path.resolve(getProjectsSourceDir(), projectId)
}

export function getXmlDir(projectId: string) {
	return path.resolve(getProjectSourceDir(projectId), 'xml')
}

export function getXMLPath(projectId: string, documentId: string) {
	return path.resolve(getXmlDir(projectId), `${documentId}.xml`)
}

export function getPageXmlPath(projectId: string, pagePath: string) {
	return path.resolve(getProjectSourceDir(projectId), 'pages', pagePath)
	// return readFileContents(p)
}

// TODO old, remove
export function getEntryIdFromFilePath(xmlFilePath: string, projectId: string) {
	const dir = path.dirname(xmlFilePath).replace(getXmlDir(projectId), '')
	const base = path.basename(xmlFilePath, '.xml')
	return `${dir}/${base}`.replace(/^\//, '')
}

export function getDocumentIdFromRemoteXmlFilePath(filePath: string, remoteDir: string, stripRemoteDir: boolean) {
	let documentId = path.resolve(path.dirname(filePath), path.basename(filePath, '.xml'))

	// Return null if withoutExtension and filePath are equal,
	// which means it's a dir or not an XML file
	if (documentId === filePath) return null

	if (stripRemoteDir) {
		const re = new RegExp(`^/?${remoteDir}/?`)
		documentId = documentId.replace(re, '')
	}

	if (documentId.charAt(0) === '/') documentId = documentId.slice(1)

	return documentId.length ? documentId : null
}

export function readFileContents(filePath: string) {
	return fs.readFileSync(filePath, 'utf8')
}

export function getType(key: string, config: DocereConfig): EsDataType {
	let type = EsDataType.Keyword

	const mdConfig = config.metadata.find(md => md.id === key)
	if (mdConfig != null && mdConfig.datatype != null) type = mdConfig.datatype

	const tdConfig = config.entities.find(md => md.id === key)
	if (tdConfig != null && tdConfig.datatype != null) type = tdConfig.datatype

	if (key === 'text') type = EsDataType.Text
	if (type === EsDataType.Hierarchy) type = EsDataType.Keyword

	if (type === EsDataType.Null) return null

	return type
}

// TODO implement. Add to build.puppenv.utils?
// export function createError(message: string) {
// 	return { __error: message }
// }

export function logError(title: string, subTitle?: string, error?: string) {
	console.log(chalk.red(title), chalk.cyan(subTitle))
	if (error != null) console.log(chalk.gray(error))
}

function getDirents(dirPath: string) {
	let projectDirs: fs.Dirent[] = []
	try {
		projectDirs = fs.readdirSync(dirPath, { withFileTypes: true })
	} catch (err) {
		logError('Unable to read projects dir', dirPath, JSON.stringify(err))
	}
	return projectDirs
}

export function listProjects() {
	const sourceDir = getProjectsSourceDir()
	const dirents = getDirents(sourceDir)

	return dirents
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
}

/**
 * Check if dirent is XML file
 */
function isXmlFile(dirent: fs.Dirent) { return dirent.isFile() && path.extname(dirent.name) === '.xml' }

/**
 * An entry can exist of multiple XML files, but this
 * recursive function returns only the "main" XML files.
 */
function getMainXmlFilePathsFromDir(dir: string, maxPerDir: number = null) {
	const files: string[] = []
	const dirents = getDirents(dir)
	let xmlFiles = dirents.filter(isXmlFile)
	if (maxPerDir != null && !isNaN(maxPerDir)) xmlFiles = xmlFiles.slice(0, maxPerDir)

	if (xmlFiles.length) {
		xmlFiles.forEach(f => files.push(`${dir}/${f.name}`))
	} else {
		dirents
			.filter(x => x.isDirectory() || x.isSymbolicLink())
			.forEach(x => {
				getMainXmlFilePathsFromDir(`${dir}/${x.name}`, maxPerDir)
					.forEach(f => files.push(f))
			})
	}

	return files
}

export async function getXmlFiles(projectId: string, maxPerDir: number = null) {
	const baseDir = getXmlDir(projectId)
	return getMainXmlFilePathsFromDir(baseDir, maxPerDir)
}

export function isError(payload: any | DocereApiError): payload is DocereApiError {
	return payload != null && payload.hasOwnProperty('__error')
}


export async function getProjectConfig(projectId: string) {
	const error: DocereApiError = { code: 404, __error: `Config data not found. Does project '${projectId}' exist?` }

	let config: DocereConfig | DocereApiError
	try {
		const configImport = await projects[projectId].config
		config = configImport == null ? error : (await configImport()).default
	} catch (err) {
		console.log(err)
		config = error
	}

	return config
}

export async function getProjectPageConfig(projectId: string, pageId: string): Promise<PageConfig | DocereApiError> {
	const config = await getProjectConfig(projectId)
	if (isError(config)) return config

	return config.pages
		.reduce((prev, curr) => {
			if (Array.isArray(curr.children)) prev.push(...curr.children)
			prev.push(curr)
			return prev
		}, [])
		.find(p => p.id === pageId)
}

export function getElasticSearchDocument(extractedEntry: SerializedEntry | DocereApiError): ElasticSearchDocument | DocereApiError {
	if (isError(extractedEntry)) return extractedEntry

	// const lookup = createLookup(extractedEntry.layers)

	const entities = Object.values(extractedEntry.textData.entities)
		.reduce((agg, [_id, entity]) => {
			agg[entity.configId] = (agg.hasOwnProperty(entity.configId)) ?
				agg[entity.configId].concat(entity.content) :
				[entity.content]
			return agg
		}, {} as Record<string, string[]>)

	const facsimiles: ElasticSearchDocument['facsimiles'] = Object.values(extractedEntry.textData.facsimiles)
		.reduce((agg, [id, facsimile]) => {
			return agg.concat(facsimile.versions.map(v => ({ id, path: v.path })))
		}, [])

	const metadata = extractedEntry.metadata?.reduce((prev, curr) => {
			if (curr.datatype === EsDataType.Hierarchy) {
				if (Array.isArray(curr.value)) {
					curr.value.forEach((v, i) => {
						prev[`${curr.id}_level${i}`] = v
					})
				}
			} else {
				prev[curr.id] = curr.value
			}
			return prev
		}, {} as Record<string, MetadataItem['value']>)

	// const notes: string[] = Object.values(lookup.notes)
	// 	.map(note => note.content)

	return {
		id: extractedEntry.id,
		facsimiles,
		// notes,
		text: extractedEntry.plainText,
		text_suggest: {
			input: extractedEntry.plainText
				.split(' ')
				.filter(t => t.trim().length > 0),
		},
		...entities,
		...metadata,
	}
}

export function sendJson(payload: any | DocereApiError, expressResponse: ExpressResponse) {
	if (isError(payload)) {
		const code = payload.hasOwnProperty('code') ? payload.code : 400
		expressResponse.status(code).send(payload.__error)
		return
	}

	expressResponse.json(payload)
}

export function sendXml(payload: string | DocereApiError, expressResponse: ExpressResponse) {
	if (isError(payload)) {
		const code = payload.hasOwnProperty('code') ? payload.code : 400
		expressResponse.status(code).send(payload.__error)
		return
	}

	expressResponse.type('text/xml').send(payload)
}

export function sendText(payload: string | DocereApiError, expressResponse: ExpressResponse) {
	if (isError(payload)) {
		const code = payload.hasOwnProperty('code') ? payload.code : 400
		expressResponse.status(code).send(payload.__error)
		return
	}

	expressResponse.type('text/plain').send(payload)
}

// The URL query ?somequery=12 is user input and is received as 
// string. This function safely converts to a number
export function castUrlQueryToNumber(query: string | string[]) {
	if (Array.isArray(query)) query = query[0]
	if (query == null) return null
	const regExpArray = /\d+/.exec(query as string)
	return Array.isArray(regExpArray) && regExpArray.length ?
		parseInt(regExpArray[0], 10) :
		null
}

// export async function getDocumentFields(projectId: string, documentId: string) {
// 	const filePath = getXMLPath(projectId, documentId)

// 	let contents
// 	try {
// 		contents = await fs.readFileSync(filePath, 'utf8')
// 	} catch (err) {
// 		return res.status(404).json({ __error: `File '${req.params.documentId}.xml' for project '${req.params.projectId}' not found`})	
// 	}

// 	let documentFields: ElasticSearchDocument
// 	try {
// 		documentFields = await puppenv.getDocumentFields(contents, req.params.projectId, req.params.documentId)
// 	} catch (err) {
// 		return { __error: err.message }
// 	}

// 	return documentFields
// }
