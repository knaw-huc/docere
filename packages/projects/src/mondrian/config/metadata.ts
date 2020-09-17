import type { ExtractedMetadata, Entry } from '@docere/common'

export default function extractMetadata(entry: Entry) {
	const metadata: ExtractedMetadata = {}

	metadata.author = entry.document.querySelector('correspAction[type="sent"] > name')?.textContent
	metadata.addressee = entry.document.querySelector('correspAction[type="received"] > name')?.textContent
	metadata.date = entry.document.querySelector('correspAction[type="sent"] > date')?.getAttribute('when')
	metadata.place = entry.document.querySelector('correspAction[type="sent"] > placeName')?.textContent
	metadata.type = entry.id.slice(0, 7) === 'brieven' ? 'brief' : 'geschrift'

	metadata.noteCount = entry.document.querySelectorAll('div[type="notes"] > note').length
	metadata.ogtNoteCount = entry.document.querySelectorAll('div[type="ogtnotes"] > note').length
	metadata.typedNoteCount = entry.document.querySelectorAll('div[type="typednotes"] > note').length

	return metadata
}
