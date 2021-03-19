import { ExtractedFacsimile, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, config }) {
	const facsimiles: ExtractedFacsimile[] = Array.from(layerElement.querySelectorAll(config.facsimiles.selector))
		.reduce((prev, scan) => {
			const path = scan.getAttribute('iiif_url').replace(/\/full\/full\/0\/default\.jpg$/, '/info.json')
			console.log(path)
			const id = config.facsimiles.extractFacsimileId(scan)

			if (!prev.some(p => p.id === id)) {
				prev.push({
					anchors: [scan],
					id,
					versions: [{
						path
					}]
				})
			}
			return prev
		}, [])

	return facsimiles
}) as ExtractFacsimiles
