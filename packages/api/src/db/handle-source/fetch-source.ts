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
	} else {
		partialStandoff = source as PartialStandoff
	}

	return projectConfig.standoff.prepareSource(partialStandoff)
}

export function sourceIsXml(_source: string | object, projectConfig: DocereConfig): _source is string {
	return projectConfig.documents.type === 'xml'
}

export async function fetchSource(
	filePath: string,
	projectConfig: DocereConfig
): Promise<string | object> {
	const url = `${XML_SERVER_ENDPOINT}${filePath}`
	const result = await fetch(url)

	if (result.status === 404) return null

	const tmp = (projectConfig.documents.type === 'xml') ?
		await result.text()	:
		await result.json()

	return tmp
}
