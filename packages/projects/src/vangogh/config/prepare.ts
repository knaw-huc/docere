import { ConfigEntry } from '@docere/common'

export default function prepareDocument(entry: ConfigEntry) {
	for (const anchor of entry.document.querySelectorAll(`anchor`)) {
		const anchorId = anchor.getAttribute('xml:id')
		const note = entry.document.querySelector(`note[target="#${anchorId}"]`)
		if (note != null) {
			anchor.setAttribute('target', note.getAttribute('xml:id'))
		}
		// note.id = generateId()
	}

	// for (const note of doc.querySelectorAll(`div[type="notes"] note[target]`)) {
	// 	note.id = note.getAttribute('target').slice(1)
	// }

	for (const ref of entry.document.querySelectorAll('ref[target]')) {
		const target = ref.getAttribute('target')
		const type = target.indexOf('#') > -1 ? 'note-link' : 'entry-link'
		ref.setAttribute('type', type)
	}

	return entry.document.documentElement
}
