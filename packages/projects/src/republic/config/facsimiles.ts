import { ExtractedFacsimile, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, config }) {
	const facsimiles: ExtractedFacsimile[] = Array.from(layerElement.querySelectorAll(config.facsimiles.selector))
		.reduce((prev, column) => {
			const path = column.getAttribute('facs')
			const id = column.getAttribute('docere:id')

			if (!prev.some(p => p.id === id)) {
				prev.push({
					anchors: [column],
					id,
					versions: [{
						path: `https://images.diginfra.net/iiif/${path}/info.json`
					}]
				})
			}
			return prev
		}, [])

	return facsimiles
}) as ExtractFacsimiles
