// import { generateId } from '@docere/common'
import type { DocereConfig } from '@docere/common'

export default function prepareDocument(doc: XMLDocument, _config: DocereConfig) {
	for (const anchor of doc.querySelectorAll(`anchor`)) {
		const anchorId = anchor.getAttribute('xml:id')
		const note = doc.querySelector(`note[target="#${anchorId}"]`)
		if (note != null) {
			anchor.setAttribute('target', note.getAttribute('xml:id'))
		}
		// note.id = generateId()
	}

	// for (const note of doc.querySelectorAll(`div[type="notes"] note[target]`)) {
	// 	note.id = note.getAttribute('target').slice(1)
	// }

	for (const ref of doc.querySelectorAll('ref[target]')) {
		const target = ref.getAttribute('target')
		const type = target.indexOf('#') > -1 ? 'note-link' : 'entry-link'
		ref.setAttribute('type', type)
	}

	return doc
}
