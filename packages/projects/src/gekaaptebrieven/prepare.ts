export default function prepareDocument(doc: XMLDocument) {
	doc.querySelectorAll('ne-start').forEach(el => {
		const range = new Range()
		range.setStartAfter(el)
		range.setEndBefore(el.nextElementSibling)
		const ner = doc.createElement('ner')
		ner.setAttribute('type', el.getAttribute('type'))
		range.surroundContents(ner)
		el.parentElement.removeChild(el)
	})
	doc.querySelectorAll('ne-end').forEach(el => el.parentElement.removeChild(el))
	return doc
}
