import { ConfigEntry, FacsimileType } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	return Array.from(entry.document.querySelectorAll('facsimile zone'))
		.map(zone => {
			const id = zone.getAttribute('xml:id')
			const graphic = zone.querySelector('graphic[rend="facstab"]')
			if (graphic == null) {
				console.log(`Graphic not found: ${id}`)
				return null
			}

			const fileName = graphic.getAttribute('url').slice(0, -5)
			const thumbFileName = fileName.concat('t.jpg')
			const fullFileName = fileName.concat('f.png')

			return {
				id,
				versions: [{
					thumbnailPath: `/iiif/vangogh/${thumbFileName}`,
					path: `/iiif/vangogh/${fullFileName}`,
					type: FacsimileType.Image,
				}]
			}
		})
		.filter(facs => facs != null)
}

// const path = `http://vangoghletters.org/vg/facsimiles/${fileName}`
