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
export async function fetchSource(
	filePath: string,
	projectConfig: DocereConfig
): Promise<PartialStandoff> {
	const result = await fetch(`${XML_SERVER_ENDPOINT}${filePath}`)

	let source: any
	if (projectConfig.documents.type === 'xml') {
		source = await result.text()	
	} else {
		source = await result.json()
	}

	if (projectConfig.standoff.prepareSource != null) {
		source = projectConfig.standoff.prepareSource(source)
	} else if (projectConfig.documents.type === 'json') {
		throw new Error("[xml2standoff] prepareSource can't be empty when the source is of type JSON")
	}

	if (typeof source === 'string') {
		try {
			return await xml2standoff(source)
		} catch (error) {
			console.log('[xml2standoff]', error)	
			return null
		}
	}

	return source
}
