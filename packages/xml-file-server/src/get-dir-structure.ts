import fs from 'fs'
import path from 'path'
import { BASE_FILE_PATH } from '.'

import type { XmlDirectoryStructure } from '@docere/common'

function getDirents(dirPath: string) {
	let projectDirs: fs.Dirent[] = []
	try {
		projectDirs = fs.readdirSync(dirPath, { withFileTypes: true })
	} catch (err) {
		return null
	}
	return projectDirs
}

const pathCreator = (dir: string) => {
	const relativePath = dir.replace(BASE_FILE_PATH, '')
	return (dirEnt: fs.Dirent) =>  path.resolve(relativePath, dirEnt.name)
}

/**
 * An entry can exist of multiple XML files, but this
 * recursive function returns only the "main" XML files.
 */
export function getDirStructure(
	dir: string,
	filterByExt: string,
	maxPerDir: number = null,
): XmlDirectoryStructure {
	const toPath = pathCreator(dir)
	let dirents = getDirents(dir)
	if (dirents == null) return

	let files = dirents

	if (filterByExt != null) {
		files = dirents
			.filter(dirent =>
				dirent.isFile() && path.extname(dirent.name) === `.${filterByExt}`
			)
	} 

	if (maxPerDir != null && !isNaN(maxPerDir)) {
		files = files.slice(0, maxPerDir)
	}

	const directories = dirents
		.filter(x => x.isDirectory() || x.isSymbolicLink())
		.map(toPath)

	return {
		directories,
		files: files.map(toPath)
	}
}
