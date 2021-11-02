import fetch from 'node-fetch'
import { DocereConfig, PartialStandoff } from '@docere/common'
import { XML_SERVER_ENDPOINT } from '../../constants'
import { xml2standoff } from '../../utils/xml2standoff'

/**
 * Fetch and prepare source file
 * 
 * The source file can be one of three types: standoff, xml (string) or json.
 * The preparation function is a user defined function {@link DocereConfig.standoff.prepareSource}
 * to make changes in the source file.
 * 
 * @param filePath 
 * @param projectConfig 
 */
export async function fetchAndPrepareSource(
	filePath: string,
	projectConfig: DocereConfig
): Promise<PartialStandoff> {
	const source = await fetchSource(filePath, projectConfig)

	let partialStandoff: PartialStandoff
	if (sourceIsXml(source, projectConfig)) {
		partialStandoff = await xml2standoff(source)
	}

	return projectConfig.standoff.prepareSource(partialStandoff)
}

export function sourceIsXml(_source: string | object, projectConfig: DocereConfig): _source is string {
	return projectConfig.documents.type === 'xml'
}

export async function fetchSource(
	documentId: string,
	projectConfig: DocereConfig
): Promise<string | object> {
	const ext = (projectConfig.documents.type === 'xml') ? '.xml' : '.json'
	const url = `${XML_SERVER_ENDPOINT}/${projectConfig.slug}/${documentId}${ext}`
	const result = await fetch(url)

	const tmp = (projectConfig.documents.type === 'xml') ?
		await result.text()	:
		await result.json()

	return tmp
}
