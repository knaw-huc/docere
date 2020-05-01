import type { DocereConfigData, ExtractedMetadata } from '@docere/common';

function normaliseDate(date: string | number) {
	date = date.toString();
	if (date === '') return null
	if (/^\d\d-\d\d-\d\d\d\d$/.test(date)) return `${date.slice(-4)}-${date.slice(3, 5)}-${date.slice(0, 2)}`
	if (/^\d\d-\d\d\d\d$/.test(date)) return `${date.slice(-4)}-${date.slice(0, 2)}-01`
	if (/^\d\d\d\d$/.test(date)) return `${date}-01-01`
	return null
}
const extractMetadata: DocereConfigData['extractMetadata'] = function extractMetadata(doc, _config, id) {
	const metadata: ExtractedMetadata = {}

	metadata.n = parseInt(id.split('_').slice(-1)[0], 10)
	metadata.blocks = doc.querySelectorAll('block').length
	metadata.chars = doc.documentElement.textContent.length
	metadata.keywords = doc.querySelector('meta[key="keywords"]').getAttribute('value').split(' ')

	metadata.normalised_dates = doc.querySelector('meta[key="date"]').getAttribute('value').split(' ')
		.map(normaliseDate)
		.filter(x => x != null)
	metadata.has_date = metadata.normalised_dates.length > 0

	metadata.toegang_level0 = /^NAN/.test(id) ? 'VOC' : 'Notariële akte'
	id.split('/').slice(-1)[0].split('_').slice(0, -1).forEach((value, index) => {
		metadata[`toegang_level${index + 1}`] = value
	})

	return metadata
}

export default extractMetadata
