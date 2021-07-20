import { DocereConfig, XmlDirectoryStructure } from '@docere/common'
import fetch from 'node-fetch'
import { XML_SERVER_ENDPOINT } from '../../constants'

import type { AddRemoteFilesOptions } from '.'

export async function fetchRemotePaths(remotePath: string, projectConfig: DocereConfig, options: AddRemoteFilesOptions) {
	if (remotePath.charAt(0) === '/') remotePath = remotePath.slice(1)

	// TODO rename XML_SERVER_ENDPOINT to FILE_SERVER_ENDPOINT
	// Fetch directory structure
	const endpoint = `${XML_SERVER_ENDPOINT}/${remotePath}`
	const result = await fetch(endpoint)
	if (result.status === 404) {
		console.log(`[${projectConfig.slug}] remote path not found: '${remotePath}'`)
		return
	}
	const dirStructure: XmlDirectoryStructure = await result.json()
	let { files, directories } = dirStructure

	// If the maxPerDir option is set, slice the files
	if (options.maxPerDir != null) {
		const maxPerDirOffset = options.maxPerDirOffset == null ? 0 : options.maxPerDirOffset
		files = files.slice(maxPerDirOffset, maxPerDirOffset + options.maxPerDir)
	}

	return [files, directories]
}
