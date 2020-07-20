import { Entry } from '@docere/common'

export default function extractFacsimiles(entry: Entry) {
	const attr = 'facs'
	const selector = `pb[${attr}]`

	let pbs = entry.document.querySelectorAll(selector)

	return Array.from(pbs)
		.map(pb => {
			const id = pb.getAttribute(attr)
			const path = `https://images.huygens.knaw.nl/iiif/${id.slice(0, -4)}.tif/info.json`
			return { id, versions: [{ path }] }
		})
}
