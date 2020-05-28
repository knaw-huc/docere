import type { ExtractedMetadata } from '@docere/common'

export default function extractMetadata(doc: XMLDocument) {
	const metadata: ExtractedMetadata = {}
	metadata.documentnr = doc.querySelector('plakkaat > documentnr')?.textContent
	metadata.doctype = doc.querySelector('doctype > doctype')?.textContent
	metadata.kolonie = Array.from(doc.querySelectorAll('kolonie > kolonie_')).map(k => k.textContent)
	metadata.uitgevende_instantie = doc.querySelector('uitgevende_instantie')?.textContent
	metadata.plaats_opmaak = doc.querySelector('plaats_opmaak')?.textContent
	metadata.keyword_subject = Array.from(doc.querySelectorAll('keyword_subject > onderwerp')).map(k => k.textContent)

	metadata.date = [] as number[]

	for (let i = 0; i < 3; i++) {
		const prop = `date${i + 1}`
		const dateElement = doc.querySelector(prop)
		console.log(dateElement)
		const year = dateElement.querySelector('year')?.textContent
		const month = dateElement.querySelector('month')?.textContent
		const day = dateElement.querySelector('day')?.textContent

		if (year.length && month.length && day.length) metadata.date.push(new Date(`${year}-${month}-${day}`).getTime())
	}
	return metadata
}
