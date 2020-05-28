export default function prepareDocument(doc: XMLDocument) {
	const transcriptieElement = doc.querySelector('transcriptie')
	transcriptieElement.innerHTML = transcriptieElement.textContent
	return doc
}
