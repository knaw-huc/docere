import { ExtractedFacsimile, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, config }) {
	const facsimiles: ExtractedFacsimile[] = Array.from(layerElement.querySelectorAll(config.facsimiles.selector))
		.reduce((prev, scan) => {
			const id = config.facsimiles.extractFacsimileId(scan)

			if (!prev.some(p => p.id === id)) {
				prev.push({
					anchors: [scan],
					id,
					versions: [{
						path: scan.getAttribute('iiif_info_url')
					}]
				})
			}
			return prev
		}, [])

	return facsimiles
}) as ExtractFacsimiles
