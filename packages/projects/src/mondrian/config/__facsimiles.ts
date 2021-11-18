import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, entry }) {
	return Array.from(layerElement.querySelectorAll('pb[facs]'))
		.map(pb => {
			const id = pb.getAttribute('facs')?.slice(1)

			const selector = `facsimile surface[*|id="${id}"]`
			const surface = entry.document.querySelector(selector)
			if (surface == null) return

			const graphic = surface.querySelector('graphic[url]')
			if (graphic == null) return 

			const fileName = graphic.getAttribute('url')
			if (!fileName.length) return null

			const imgPath = fileName.slice(0, fileName.indexOf('_')) + '/' + fileName
			const path = `/iiif/mondrian/${imgPath}.jpg/info.json`

			return {
				anchor: pb,
				id,
				path
			}
		})
}) as ExtractFacsimiles
