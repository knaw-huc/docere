export default function extractTextLayers(doc: XMLDocument) {
	return Array.from(doc.querySelectorAll('transcription'))
		.map(element => ({
			element,
			id: element.querySelector('lang').textContent
		}))
}
