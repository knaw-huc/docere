import type { ExtractedMetadata, Entry } from '@docere/common'

export default function extractMetadata(entry: Entry) {
	const metadata: ExtractedMetadata = {}
	metadata.documentnr = entry.document.querySelector('plakkaat > documentnr')?.textContent
	metadata.doctype = entry.document.querySelector('doctype > doctype')?.textContent
	metadata.kolonie = Array.from(entry.document.querySelectorAll('kolonie > kolonie_')).map(k => k.textContent)
	metadata.uitgevende_instantie = entry.document.querySelector('uitgevende_instantie')?.textContent
	metadata.plaats_opmaak = entry.document.querySelector('plaats_opmaak')?.textContent
	metadata.keyword_subject = Array.from(entry.document.querySelectorAll('keyword_subject > onderwerp')).map(k => k.textContent)

	metadata.date = [] as number[]

	for (let i = 0; i < 3; i++) {
		const prop = `date${i + 1}`
		const dateElement = entry.document.querySelector(prop)
		const year = dateElement.querySelector('year')?.textContent
		const month = dateElement.querySelector('month')?.textContent
		const day = dateElement.querySelector('day')?.textContent

		if (year.length && month.length && day.length) metadata.date.push(new Date(`${year}-${month}-${day}`).getTime())
	}
	return metadata
}
