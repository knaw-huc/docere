import { ExtractedEntry } from '@docere/common'

export default function prepareDocument(entry: ExtractedEntry) {
	for (const ref of entry.document.querySelectorAll('ref[target]')) {
		const target = ref.getAttribute('target')
		const type = target.indexOf('#') > -1 ? 'note-link' : 'entry-link'
		ref.setAttribute('type', type)
	}

	return entry.document.documentElement
}
