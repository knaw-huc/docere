import path from 'path'
import { DocereConfig } from "@docere/common"

export function getSourceIdFromRemoteFilePath(
	filePath: string,
	config: DocereConfig,
	isPage = false
) {
	// const ext = config.documents.type === 'xml' ? 'xml' : 'json'
	// let sourceId = path.resolve(path.dirname(filePath), path.basename(filePath, `.${ext}`))

	const parsedPath = path.parse(filePath)
	if (!parsedPath.ext.length) return null

	let sourceId = `${parsedPath.dir}/${parsedPath.name}`

	// Return null if withoutExtension and filePath are equal,
	// which means it's a dir or not an XML file
	// console.log(sourceId, filePath)
	// if (sourceId === filePath) return null

	// if (sourceId.charAt(0) === '/') sourceId = sourceId.slice(1)

	const re = new RegExp(`^/${config.slug}/?`)
	sourceId = sourceId.replace(re, '')

	if (isPage) {
		if (config.pages.remotePath.length) {
			const re2 = new RegExp(`^${config.pages.remotePath}`)
			sourceId = sourceId.replace(re2, '')
		}
	} else {
		if (config.documents.remotePath.length) {
			const re2 = new RegExp(`^${config.documents.remotePath}`)
			sourceId = sourceId.replace(re2, '')
		}
	}

	// if (sourceId.charAt(0) === '/') sourceId = sourceId.slice(1)

	return sourceId.length ? sourceId : null
}
