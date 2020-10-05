import fs from 'fs'
import path from 'path'
import { BASE_PATH } from '.'

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

/**
 * Check if dirent is XML file
 */
function isXmlFile(dirent: fs.Dirent) {
	return dirent.isFile() && path.extname(dirent.name) === '.xml'
}

const pathCreator = (dir: string) => {
	const relativePath = dir.replace(BASE_PATH, '')
	return (dirEnt: fs.Dirent) =>  path.resolve(relativePath, dirEnt.name)
}

/**
 * An entry can exist of multiple XML files, but this
 * recursive function returns only the "main" XML files.
 */
export function getDirStructure(
	dir: string,
	maxPerDir: number = null,
): XmlDirectoryStructure {
	const toPath = pathCreator(dir)
	const dirents = getDirents(dir)
	if (dirents == null) return

	let xmlFiles = dirents.filter(isXmlFile)
	if (maxPerDir != null && !isNaN(maxPerDir)) xmlFiles = xmlFiles.slice(0, maxPerDir)
	const files = xmlFiles.map(toPath)

	const directories = dirents
		.filter(x => x.isDirectory() || x.isSymbolicLink())
		.map(toPath)

	return {
		directories,
		files
	}
}
