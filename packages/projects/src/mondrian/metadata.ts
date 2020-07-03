import type { DocereConfigData, ExtractedMetadata } from '@docere/common'

const extractMetadata: DocereConfigData['extractMetadata'] = function extractMetadata(doc, _config, id) {
	const metadata: ExtractedMetadata = {}

	metadata.author = doc.querySelector('correspAction[type="sent"] > name')?.textContent
	metadata.addressee = doc.querySelector('correspAction[type="received"] > name')?.textContent
	metadata.date = doc.querySelector('correspAction[type="sent"] > date')?.getAttribute('when')
	metadata.place = doc.querySelector('correspAction[type="sent"] > placeName')?.textContent
	metadata.type = id.slice(0, 7) === 'brieven' ? 'brief' : 'geschrift'

	return metadata
}

export default extractMetadata
