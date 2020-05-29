import type { ExtractedMetadata } from '@docere/common'

export default function extractMetadata(doc: XMLDocument, _config: any, id: string) {
	const metadata: ExtractedMetadata = {}
	metadata.editie = doc.querySelector('editie')?.textContent
	metadata.oorkonder = doc.querySelector('oorkonder')?.textContent
	metadata.destinataris = doc.querySelector('destinataris')?.textContent
	metadata.namen = Array.from(doc.querySelectorAll('namen > naam')).map(k => k.textContent)
	metadata.trefwoorden = Array.from(doc.querySelectorAll('trefwoorden > trefwoord')).map(k => k.textContent)
	metadata.register_code = Array.from(doc.querySelectorAll('register')).map(k => k.textContent.slice(0, k.textContent.indexOf(' ('))).filter(x => x.length > 0)
	metadata.register = Array.from(doc.querySelectorAll('register')).map(k => k.textContent).filter(x => x.length > 0)

	const [regio, entryId] = id.split('/')
	metadata.regio = regio

	const [regioCode, n] = entryId.split('_')
	metadata.regioCode = regioCode
	metadata.n = n

	const dateElement = doc.querySelector('datum')
	const year = dateElement.querySelector('year')?.textContent
	const month = dateElement.querySelector('month')?.textContent
	const day = dateElement.querySelector('day')?.textContent
	if (year.length && month.length && day.length) metadata.datum = new Date(`${year}-${month}-${day}`).getTime()

	return metadata
}
