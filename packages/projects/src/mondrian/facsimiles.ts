import type { DocereConfigData } from '@docere/common'

const extractFacsimiles: DocereConfigData['extractFacsimiles'] = function extractFacsimiles(doc) {
	return Array.from(doc.querySelectorAll('facsimile surface'))
		.map(surface => {
			const id = surface.getAttribute('xml:id')
			const graphic = surface.querySelector('graphic')
			if (graphic == null) {
				console.log(`Graphic not found: ${id}`)
				return null
			}
			const fileName = graphic.getAttribute('url')
			const imgPath = fileName.slice(0, fileName.indexOf('_')) + '/' + fileName
			const path = `http://localhost:4000/iiif/mondrian/${imgPath}.jpg/info.json`
			return { id, versions: [{ path }] }
		})
		.filter(facs => facs != null)
}
export default extractFacsimiles

