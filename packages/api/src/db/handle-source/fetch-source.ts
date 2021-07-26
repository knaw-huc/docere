import fetch from 'node-fetch'
import { DocereConfig } from '@docere/common'
import { XML_SERVER_ENDPOINT } from '../../constants'

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
): Promise<any> {
	const result = await fetch(`${XML_SERVER_ENDPOINT}${filePath}`)

	let source: string | object
	if (projectConfig.documents.type === 'xml') {
		source = await result.text()	
	} else {
		source = await result.json()
	}

	return source
}
