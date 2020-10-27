import { ConfigEntry } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	const attr = 'facs'
	const selector = `pb[${attr}]`

	let pbs = entry.document.querySelectorAll(selector)

	return Array.from(pbs)
		.map(pb => {
			const id = pb.getAttribute(attr).slice(0, -4)
			const path = `https://images.huygens.knaw.nl/iiif/${id}.tif/info.json`
			return { id, versions: [{ path }] }
		})
}
