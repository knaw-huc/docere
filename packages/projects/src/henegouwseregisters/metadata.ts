import type { ExtractedMetadata, Entry } from '@docere/common'

export default function extractMetadata(entry: Entry) {
	const metadata: ExtractedMetadata = {}
	metadata.editie = entry.document.querySelector('editie')?.textContent
	metadata.oorkonder = entry.document.querySelector('oorkonder')?.textContent
	metadata.destinataris = entry.document.querySelector('destinataris')?.textContent
	metadata.namen = Array.from(entry.document.querySelectorAll('namen > naam')).map(k => k.textContent)
	metadata.trefwoorden = Array.from(entry.document.querySelectorAll('trefwoorden > trefwoord')).map(k => k.textContent)
	metadata.register_code = Array.from(entry.document.querySelectorAll('register')).map(k => k.textContent.slice(0, k.textContent.indexOf(' ('))).filter(x => x.length > 0)
	metadata.register = Array.from(entry.document.querySelectorAll('register')).map(k => k.textContent).filter(x => x.length > 0)

	const [regio, entryId] = entry.id.split('/')
	metadata.regio = regio

	const [regioCode, n] = entryId.split('_')
	metadata.regioCode = regioCode
	metadata.n = n

	const dateElement = entry.document.querySelector('datum')
	const year = dateElement.querySelector('year')?.textContent
	const month = dateElement.querySelector('month')?.textContent
	const day = dateElement.querySelector('day')?.textContent
	if (year.length && month.length && day.length) metadata.datum = new Date(`${year}-${month}-${day}`).getTime()

	return metadata
}
