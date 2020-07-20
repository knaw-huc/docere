import { Entry } from '@docere/common'

export default function extractFacsimiles(entry: Entry) {
	return Array.from(entry.document.querySelectorAll('facsimile zone'))
		.map(zone => {
			const id = zone.getAttribute('xml:id')
			const graphic = zone.querySelector('graphic[rend="facstab"]')
			if (graphic == null) {
				console.log(`Graphic not found: ${id}`)
				return null
			}
			const fileName = graphic.getAttribute('url').slice(0, -5).concat('t.jpg')
			const path = `http://vangoghletters.org/vg/facsimiles/${fileName}`
			return { id, versions: [{ path }] }
		})
		.filter(facs => facs != null)
}
