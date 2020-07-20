import type { ExtractedMetadata, Entry } from '@docere/common'

export default function extractMetadata(entry: Entry) {
	const selector = "meta"
	let els = entry.document.querySelectorAll(selector)
	const metadata: ExtractedMetadata = {}
	Array.from(els).forEach(el => {
		metadata[el.getAttribute('type')] = el.getAttribute('value')
	})

	// Add has_date boolean
	metadata.has_date = metadata.hasOwnProperty('date') && metadata.date !== '' && metadata.date != null

	// Add a sender_or_recipient array
	const persons = []
		.concat(metadata.sender, metadata.recipient)
		.filter(p => p != null)
	metadata.sender_or_recipient = persons

	function split(key: string) {
		const values = (metadata[key] as string).split(/;|\//).map(part => part.trim())
		metadata[key] = [...new Set(values)]
	}

	split('texttypes')
	split('languages')

	return metadata
}
