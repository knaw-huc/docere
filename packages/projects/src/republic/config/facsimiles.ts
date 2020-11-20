import { ExtractedFacsimile, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	const facsimiles: ExtractedFacsimile[] = Array.from(layerElement.querySelectorAll('column[facs]'))
		.reduce((prev, column) => {
			const id = column.getAttribute('facs')
			if (!prev.some(p => p.id === id)) {
				prev.push({
					anchors: [column],
					id,
					versions: [{
						path: `https://images.diginfra.net/iiif/${id}/info.json`
					}]
				})
			}
			return prev
		}, [])

	return facsimiles
}) as ExtractFacsimiles
