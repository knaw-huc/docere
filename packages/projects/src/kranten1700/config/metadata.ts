import type { ConfigEntry, ExtractedMetadata } from '@docere/common'

export default function extractMetadata(entry: ConfigEntry) {
	const selector = "meta"
	let els = entry.document.querySelectorAll(selector)
	const metadata: ExtractedMetadata = {}
	Array.from(els).forEach(el => {
		let id = el.getAttribute('id')
		if (id === 'id') id = 'docId'
		metadata[id] = el.textContent
	})

	return metadata
}
