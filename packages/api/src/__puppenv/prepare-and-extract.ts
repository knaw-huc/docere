import type { PrepareAndExtractOutput, DocereApiError } from '../types'
import type { SerializeEntry, ExtractEntry } from './utils'
import type { ProjectList, DocereConfig, XmlToString, GetDefaultExtractedEntry } from '@docere/common'

declare global {
	// const DocereProjects: any
	const PuppenvData: {
		utils: {
			getDefaultExtractedEntry: GetDefaultExtractedEntry
			extractEntry: ExtractEntry
			serializeEntry: SerializeEntry
			xmlToString: XmlToString
		},
		projects: {
			default: ProjectList
		}
	}
}

export async function prepareAndExtract(xml: string, documentId: string, projectId: string): Promise<PrepareAndExtractOutput | DocereApiError> {
	const domParser = new DOMParser()
	let xmlRoot: XMLDocument

	// TODO fix if configData not found
	// const config: DocereConfig = (await DocereProjects.default[projectId].config()).default
	const config: DocereConfig = (await PuppenvData.projects.default[projectId].config()).default

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

	const entryTmp = PuppenvData.utils.getDefaultExtractedEntry(documentId)
	entryTmp.document = xmlRoot

	// Prepare document
	// let doc: XMLDocument
	try {
		entryTmp.preparedElement = config.prepare(entryTmp, config)
	} catch (err) {
		return { __error: `Document ${documentId}: Preparation error\n${err.toString()}` }
	}

	for (const entityConfig of config.entities) {
		for (const el of entryTmp.preparedElement.querySelectorAll(entityConfig.selector)) {
			el.setAttribute('docere:id', entityConfig.extractId(el))
			el.setAttribute('docere:type', entityConfig.id)
		}
	}

	for (const el of entryTmp.preparedElement.querySelectorAll(config.facsimiles.selector)) {
		el.setAttribute('docere:id', config.facsimiles.extractFacsimileId(el))
		el.setAttribute('docere:type', 'facsimile')
	}

	const entry = PuppenvData.utils.extractEntry({
		config,
		id: entryTmp.id,
		document: entryTmp.document,
		preparedElement: entryTmp.preparedElement,
	})

	return [
		PuppenvData.utils.serializeEntry(entry, config),
		{
			original: xml,
			prepared: PuppenvData.utils.xmlToString(entry.preparedElement),
		}
	]
}
