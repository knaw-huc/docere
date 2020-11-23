import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	const attr = 'facs'
	const selector = `pb[${attr}]`

	let pbs = layerElement.querySelectorAll(selector)

	return Array.from(pbs)
		.map(pb => {
			const id = pb.getAttribute(attr).slice(0, -4)
			const path = `https://images.huygens.knaw.nl/iiif/${id}.tif/info.json`
			return {
				anchors: [pb],
				id,
				versions: [{ path }]
			}
		})
}) as ExtractFacsimiles
