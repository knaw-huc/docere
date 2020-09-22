import * as path from 'path'
import * as fs from 'fs'
import { Response as ExpressResponse } from 'express'
import chalk from 'chalk'
import { EsDataType, LayerType } from '../../common/src/enum'

import type { DocereApiError, ElasticSearchDocument } from './types'
import type { DocereConfig } from '../../common/src/types/config-data/config'
import type { SerializedEntry } from '../../common/src/types/entry'

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

export function getEntryIdFromFilePath(xmlFilePath: string, projectId: string) {
	const dir = path.dirname(xmlFilePath).replace(getXmlDir(projectId), '')
	const base = path.basename(xmlFilePath, '.xml')
	return `${dir}/${base}`.replace(/^\//, '')
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

export function getElasticSearchDocument(extractedEntry: SerializedEntry | DocereApiError): ElasticSearchDocument | DocereApiError {
	if (isError(extractedEntry)) return extractedEntry

	const entities = extractedEntry.entities.reduce((prev, curr) => {
		prev[curr.config.id] = (prev.hasOwnProperty(curr.config.id)) ?
			prev[curr.config.id].concat(curr.value) :
			[curr.value]

		return prev
	}, {} as Record<string, string[]>)

	const facsimiles: string[] = extractedEntry.layers
		.reduce((prev, curr) => {
			if (curr.type === LayerType.Facsimile) {
				const f = curr.facsimiles.reduce((prev, curr) => prev.concat(curr.versions.map(v => v.path)), [] as string[])
				prev = prev.concat(f)
			}
			return prev
		}, [])

	return {
		id: extractedEntry.id,
		facsimiles,
		text: extractedEntry.plainText,
		text_suggest: {
			input: extractedEntry.plainText
				.split(' ')
				.filter(t => t.trim().length > 0),
		},
		...entities,
		...extractedEntry.metadata
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
