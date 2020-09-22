import type { PrepareAndExtractOutput, DocereApiError } from '../types'
import type { DocereConfig, GetEntrySync, GetDefaultEntry } from '../../../common/src'
import { SerializeEntry } from '@docere/common'

declare global {
	const DocereProjects: any
	const PuppenvUtils: {
		getDefaultEntry: GetDefaultEntry
		getEntrySync: GetEntrySync
		serializeEntry: SerializeEntry
	}
}

export async function prepareAndExtract(xml: string, documentId: string, projectId: string): Promise<PrepareAndExtractOutput | DocereApiError> {
	const domParser = new DOMParser()
	let xmlRoot: XMLDocument

	// TODO fix if configData not found
	const config: DocereConfig = (await DocereProjects.default[projectId].config()).default

	try {
		xmlRoot = domParser.parseFromString(xml, "application/xml")
	} catch (err) {
		return { __error: `Document ${documentId}: XML parser error\n${err.toString()}` }
	}

	if (xmlRoot.querySelector('parsererror')) {
		// Check the namespace to be certain it is a parser error and not an element named "parsererror"
		// See: https://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
		const parsererrorNS = domParser.parseFromString('INVALID', 'text/xml').getElementsByTagName("parsererror")[0].namespaceURI
		const parsererrors = xmlRoot.getElementsByTagNameNS(parsererrorNS, 'parsererror')
		if (parsererrors.length) {
			return { __error: parsererrors[0].textContent }
		}
	}

	const entryTmp = PuppenvUtils.getDefaultEntry(documentId)
	entryTmp.document = xmlRoot

	// Prepare document
	// let doc: XMLDocument
	try {
		entryTmp.element = config.prepare(entryTmp, config)
	} catch (err) {
		return { __error: `Document ${documentId}: Preparation error\n${err.toString()}` }
	}

	const entry = PuppenvUtils.getEntrySync({
		config,
		id: entryTmp.id,
		document: entryTmp.document,
		element: entryTmp.element,
	})

	return [
		PuppenvUtils.serializeEntry(entry, config),
		{
			original: xml,
			prepared: new XMLSerializer().serializeToString(entry.document),
		}
	]
}
