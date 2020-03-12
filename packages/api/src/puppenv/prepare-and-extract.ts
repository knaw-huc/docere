declare global {
	const DocereProjects: any
}

export async function prepareAndExtract(xml: string, documentId: string, projectId: string): Promise<PrepareAndExtractOutput | { __error: string }> {
	const domParser = new DOMParser()
	let xmlRoot: XMLDocument

	// TODO fix if configData not found
	const docereConfigData: DocereConfigData = (await DocereProjects.default[projectId]()).default

	try {
		xmlRoot = domParser.parseFromString(xml, "application/xml")
	} catch (err) {
		return { __error: `Document ${documentId}: XML parser error\n${JSON.stringify(err)}` }
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

	// TODO use ID for when splitting is needed
	// Prepare document
	// console.log(prepareDocument.toString())
	let doc: XMLDocument
	try {
		doc = await docereConfigData.prepareDocument(xmlRoot, docereConfigData.config, documentId)
	} catch (err) {
		return { __error: `Document ${documentId}: Preparation error\n${err.toString()}` }
	}

	// Entities
	// let entities: Record<string, string[]> = {}
	let entities: Entity[] = []
	try {
		entities = docereConfigData.extractEntities(doc, docereConfigData.config)
	} catch (err) {
		return { __error: `Document ${documentId}: Entity extraction error\n${JSON.stringify(err)}` }
	}

	// Metadata
	let metadata: Metadata = {}
	try {
		metadata = docereConfigData.extractMetadata(doc, docereConfigData.config, documentId)
	} catch (err) {
		return { __error: `Document ${documentId}: Metadata extraction error\n${JSON.stringify(err)}` }
	}

	// Notes
	let notes: Note[] = []
	try {
		notes = docereConfigData.extractNotes(doc, docereConfigData.config)
	} catch (err) {
		return { __error: `Document ${documentId}: Note extraction error\n${JSON.stringify(err)}` }
	}

	// Facsimiles
	let facsimiles: Facsimile[] = []
	try {
		facsimiles = docereConfigData.extractFacsimiles(doc, docereConfigData.config, documentId)

		// For indexing, we only need the facsimile paths
		// facsimiles = facsimiles.reduce((prev, curr) => prev.concat(curr.versions.map(v => v.path)), [])
	} catch (err) {
		return { __error: `Document ${documentId}: Facsimile extraction error\n${err.toString()}` }
	}


	// Layers
	let layers: ExtractedLayer[] = []
	try {
		layers = docereConfigData.extractLayers(doc, docereConfigData.config)
	} catch (err) {
		return { __error: `Document ${documentId}: Layer extraction error\n${err.toString()}` }
	}

	const text = docereConfigData.extractText(doc, docereConfigData.config)

	return {
		id: documentId,
		text,
		facsimiles,
		metadata,
		notes,
		entities,
		layers,
	}
}
