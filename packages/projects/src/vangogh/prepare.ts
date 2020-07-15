import { generateId } from '@docere/common'
import type { DocereConfig } from '@docere/common'

export default function prepareDocument(doc: XMLDocument, _config: DocereConfig) {
	for (const note of doc.querySelectorAll(`div[type="textualNotes"] note`)) {
		note.id = generateId()
	}

	for (const note of doc.querySelectorAll(`div[type="notes"] note[target]`)) {
		note.id = note.getAttribute('target').slice(1)
	}

	for (const ref of doc.querySelectorAll('ref[target]')) {
		const target = ref.getAttribute('target')
		const type = target.indexOf('#') > -1 ? 'note' : 'entry'
		ref.setAttribute('type', type)
	}

	return doc
}
