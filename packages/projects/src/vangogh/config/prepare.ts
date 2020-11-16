import { ConfigEntry } from '@docere/common'

export default function prepareDocument(entry: ConfigEntry) {
	// for (const anchor of entry.document.querySelectorAll(`anchor`)) {
	// 	anchor.setAttribute('docere:id', anchor.getAttribute('xml:id'))
	// }

	// for (const ref of entry.document.querySelectorAll('ref[target]')) {
	// 	ref.setAttribute('docere:id', ref.getAttribute('target'))
	// }
	// for (const ref of entry.document.querySelectorAll('rs[key]')) {
	// 	ref.setAttribute('docere:id', ref.getAttribute('key'))
	// }

	// for (const pb of entry.document.querySelectorAll('pb')) {
	// 	pb.setAttribute('docere:id', pb.getAttribute('facs').slice(1))
	// }

	for (const ref of entry.document.querySelectorAll('ref[target]')) {
		const target = ref.getAttribute('target')
		const type = target.indexOf('#') > -1 ? 'note-link' : 'entry-link'
		ref.setAttribute('type', type)
	}

	return entry.document.documentElement
}
