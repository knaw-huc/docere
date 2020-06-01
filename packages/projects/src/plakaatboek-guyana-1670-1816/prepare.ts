function replacer(_match: string, offset: number) {
	return `<note id="note_${offset}">`
}
export default function prepareDocument(doc: XMLDocument) {
	const transcriptieElement = doc.querySelector('transcriptie')
	transcriptieElement.innerHTML = transcriptieElement.textContent
		.replace(/{/g, replacer)
		.replace(/}/g, '</note>')
	return doc
}
