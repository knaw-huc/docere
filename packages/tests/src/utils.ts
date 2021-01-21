import fetch from 'node-fetch'
import { prepareAndExtract } from '../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../api/src/utils'
import { Mapping } from '../../api/src/types'
import { SerializedEntry } from '../../common/src'

import dotenv from 'dotenv'
dotenv.config({ path: '../../.env.development'})

async function fetchXml(filePath: string) {
	const url = `${process.env.DOCERE_XML_URL}${filePath}`
	const result = await fetch(url)
	return await result.text()	
}

export async function fetchEntry(projectId: string, documentId: string, filePath?: string): Promise<SerializedEntry> {
	if (filePath == null) filePath = `${projectId}/${documentId}.xml`
	const xml = await fetchXml(filePath)

	const result = await page.evaluate(
		prepareAndExtract,
		xml,
		documentId,
		projectId,
	) 
	if (isError(result)) throw Error(result.__error)

	return result[0]
}

export async function fetchMapping(projectId: string): Promise<Mapping> {
	const fetchResult = await fetch(`http://localhost/api/projects/${projectId}/mapping`)
	return await fetchResult.json()
}
