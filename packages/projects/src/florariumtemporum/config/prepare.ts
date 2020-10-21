import { ConfigEntry } from '@docere/common'

export default function prepareDocument(entry: ConfigEntry) {
	const mainDiv = entry.document.querySelector('text > body > div')

	const mainDivId = mainDiv.getAttribute('xml:id')
	const mainDivNumber = /\d+/.exec(mainDivId)
	if (!Array.isArray(mainDivNumber)) return

	const pb = entry.document.createElement('pb')
	// @ts-ignore
	const n = (parseInt(mainDivNumber[0], 10) + 3).toString().padStart(4, '0')
	pb.setAttribute('path', `/iiif/florariumtemporum/duisburg/AA_0640_C_X_00002_${n}.jpg/info.json`)

	mainDiv.prepend(pb)

	return entry.document.documentElement
}
