import { DocereConfig, PartialStandoff } from "../.."
import { isBrowser, isNode } from 'browser-or-node'


/**
 * Prepare source for further processing.
 * 
 * The source can be XML (string) or JSON (either some arbitrary JSON or
 * (partial) Standoff). The string or JSON can be preprocessed by the 
 * {@link DocereConfig.standoff.prepareSource} function. If the source is
 * a (XML) string, it is converted PartialStandoff
 * 
 * @param source 
 * @param projectConfig 
 * @returns 
 */
export async function prepareSource(
	source: string | object,
	projectConfig: DocereConfig
): Promise<PartialStandoff> {
	let preparedSource: PartialStandoff | string

	if (projectConfig.standoff.prepareSource != null) {
		preparedSource = projectConfig.standoff.prepareSource(source)
	} else if (projectConfig.documents.type === 'json') {
		throw new Error("[xml2standoff] prepareSource can't be empty when the source is of type JSON")
	}

	let partialStandoff: PartialStandoff
	if (typeof preparedSource === 'string') {
		if (isBrowser) {
			try {
				const response  = await fetch('/api/xml2standoff', {
					method: 'POST',
					body: preparedSource,
					headers: {
						'Content-Type': 'application/xml'
					}
				})

				partialStandoff = await response.json()
			} catch (error) {
				console.log('[xml2standoff]', error)	
				return
			}
		} else if (isNode) {
			xml2standoff

		}
	} else {
		partialStandoff = preparedSource
	}

	return partialStandoff
}
