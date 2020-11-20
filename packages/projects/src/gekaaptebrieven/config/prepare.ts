import { ExtractedEntry } from '@docere/common'

export default function prepareDocument(entry: ExtractedEntry) {
	entry.document.querySelectorAll('ne-start').forEach(el => {
		const range = new Range()
		range.setStartAfter(el)
		range.setEndBefore(el.nextElementSibling)
		const ner = entry.document.createElement('ner')
		ner.setAttribute('type', el.getAttribute('type'))
		range.surroundContents(ner)
		el.parentElement.removeChild(el)
	})
	entry.document.querySelectorAll('ne-end').forEach(el => el.parentElement.removeChild(el))
	return entry.document.documentElement
}
