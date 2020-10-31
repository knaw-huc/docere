import { ConfigEntry } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	return Array.from(entry.document.querySelectorAll('facsimile surface'))
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
			console.log(imgPath)
			const path = `/iiif/mondrian/${imgPath}.jpg/info.json`
			return { id: surfaceId, versions: [{ path }] }
		})
		.filter(facs => facs != null)
}
