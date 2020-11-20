import { ExtractedFacsimile } from '@docere/common'

export default function extractFacsimiles(layerElement: Element) {
	const facsimiles: ExtractedFacsimile[] = Array.from(layerElement.querySelectorAll('column[facs]'))
		.reduce((prev, column) => {
			const id = column.getAttribute('facs')
			// column.setAttribute('docere:id', id)
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
}

