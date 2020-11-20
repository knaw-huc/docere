import type { ExtractedEntry } from '@docere/common'

function normaliseDate(date: string) {
	date = date.toString()
	if (date === '') return null

	if (/^\d\d-\d\d-\d\d\d\d$/.test(date)) date = `${date.slice(-4)}-${date.slice(3, 5)}-${date.slice(0, 2)}`
	if (/^\d\d-\d\d\d\d$/.test(date)) date = `${date.slice(-4)}-${date.slice(0, 2)}-01`
	if (/^\d\d\d\d$/.test(date)) date = `${date}-01-01`

	const d = new Date(date)

	return isNaN(d.getTime()) ? null : d.getTime()
}
export function extractNormalisedDates(entry: ExtractedEntry) {
	return entry.document.querySelector('meta[key="date"]').getAttribute('value').split(' ')
		.map(normaliseDate)
		.filter(x => x != null)
}

export function hasDate(entry: ExtractedEntry) {
	return extractNormalisedDates(entry).length > 0
}
