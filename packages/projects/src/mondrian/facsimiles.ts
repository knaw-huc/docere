import type { DocereConfigData } from '@docere/common'

const extractFacsimiles: DocereConfigData['extractFacsimiles'] = function extractFacsimiles(doc) {
	return Array.from(doc.querySelectorAll('facsimile surface'))
		.map(surface => {
			const surfaceId = surface.getAttribute('xml:id') 
			const graphic = surface.querySelector('graphic[url]')
			if (graphic == null) {
				console.log(`Graphic not found: ${surfaceId}`)
				return null
			}
			const fileName = graphic.getAttribute('url')
			if (!fileName.length) return null
			const imgPath = fileName.slice(0, fileName.indexOf('_')) + '/' + fileName
			const path = `/iiif/mondrian/${imgPath}.jpg/info.json`
			return { id: surfaceId, versions: [{ path }] }
		})
		.filter(facs => facs != null)
}
export default extractFacsimiles

