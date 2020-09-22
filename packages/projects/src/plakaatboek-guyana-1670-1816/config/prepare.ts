import { ConfigEntry } from '@docere/common'

function replacer(_match: string, offset: number) {
	return `<note id="note_${offset}">`
}
export default function prepareDocument(entry: ConfigEntry) {
	const transcriptieElement = entry.document.querySelector('transcriptie')
	transcriptieElement.innerHTML = transcriptieElement.textContent
		.replace(/{/g, replacer)
		.replace(/}/g, '</note>')
	return entry.document.documentElement
}
