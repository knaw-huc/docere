import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement }) {
	return Array.from(layerElement.querySelectorAll('facsimile surface'))
		.map(surface => {
			const surfaceId = surface.getAttribute('xml:id') 
			const graphic = surface.querySelector('graphic[url]')
			if (graphic == null) {
				console.log(`Graphic not found: ${surfaceId}`)
				return null
			}
			const fileName = graphic.getAttribute('url').replace(/^..\/images\//, '')
			if (!fileName.length) return null
			const imgPath = fileName.slice(0, fileName.indexOf('_')) + '/' + fileName
			const path = `/iiif/isidore/${imgPath}/info.json`

			return {
				id: surfaceId,
				path
			}
		})
		.filter(facs => facs != null)
}) as ExtractFacsimiles
