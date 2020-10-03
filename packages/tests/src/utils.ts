import fetch from 'node-fetch'
import { prepareAndExtract } from '../../api/src/puppenv/prepare-and-extract'
import { isError } from '../../api/src/utils'
import { SerializedEntry } from '../../common/src'
import { Mapping } from '../../api/src/types'

export async function fetchEntry(projectId: string, documentId: string): Promise<SerializedEntry> {
	const fetchResult = await fetch(`http://localhost/api/projects/${projectId}/xml/${encodeURIComponent(documentId)}`)
	const xml = await fetchResult.text()

	const result = await page.evaluate(
		prepareAndExtract,
		xml,
		documentId,
		projectId,
	) 
	if (isError(result)) return

	return result[0]
}

export async function fetchMapping(projectId: string): Promise<Mapping> {
	const fetchResult = await fetch(`http://localhost/api/projects/${projectId}/mapping`)
	return await fetchResult.json()
}
