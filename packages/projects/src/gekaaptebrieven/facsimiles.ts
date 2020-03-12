export default function extractFacsimiles(doc: XMLDocument) {
	const attr = 'facs'
	const selector = `pb[${attr}]`

	let pbs = doc.querySelectorAll(selector)

	return Array.from(pbs)
		.map(pb => {
			const id = pb.getAttribute(attr)
			const path = `https://images.huygens.knaw.nl/iiif/${id.slice(0, -4)}.tif/info.json`
			return { id, versions: [{ path }] }
		})
}
