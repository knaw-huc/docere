import type { ExtractedMetadata, Entry } from '@docere/common';

function normaliseDate(date: string) {
	date = date.toString()
	if (date === '') return null

	if (/^\d\d-\d\d-\d\d\d\d$/.test(date)) date = `${date.slice(-4)}-${date.slice(3, 5)}-${date.slice(0, 2)}`
	if (/^\d\d-\d\d\d\d$/.test(date)) date = `${date.slice(-4)}-${date.slice(0, 2)}-01`
	if (/^\d\d\d\d$/.test(date)) date = `${date}-01-01`

	const d = new Date(date)

	return isNaN(d.getTime()) ? null : d.getTime()
}
export default function extractMetadata(entry: Entry) {
	const metadata: ExtractedMetadata = {}

	metadata.n = parseInt(entry.id.split('_').slice(-1)[0], 10)
	metadata.blocks = entry.document.querySelectorAll('block').length
	metadata.chars = entry.document.documentElement.textContent.length
	metadata.keywords = entry.document.querySelector('meta[key="keywords"]').getAttribute('value').split(' ')
		.filter(x => x.length)

	metadata.normalised_dates = entry.document.querySelector('meta[key="date"]').getAttribute('value').split(' ')
		.map(normaliseDate)
		.filter(x => x != null)
	metadata.has_date = metadata.normalised_dates.length > 0

	metadata.toegang_level0 = /^NAN/.test(entry.id) ? 'VOC' : 'Notariële akte'
	entry.id.split('/').slice(-1)[0].split('_').slice(0, -1).forEach((value, index) => {
		metadata[`toegang_level${index + 1}`] = value
	})

	return metadata
}
