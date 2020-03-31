import { generateId } from '@docere/common'
import type { DocereConfig } from '@docere/common'

export default function prepareDocument(doc: XMLDocument, _config: DocereConfig) {
	for (const note of doc.querySelectorAll(`div[type="textualNotes"] note`)) {
		note.id = generateId()
	}

	for (const note of doc.querySelectorAll(`div[type="notes"] note`)) {
		note.id = note.getAttribute('target').slice(1)
	}

	return doc
}
