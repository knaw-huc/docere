import { FacsimileType, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, layer, entry }) {
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

			const anchors = Array.from(layerElement.querySelectorAll(`pb[facs="#${id}"]`))

			return {
				anchors,
				id,
				layerId: layer.id,
				versions: [{
					thumbnailPath: `/iiif/vangogh/${thumbFileName}`,
					path: `/iiif/vangogh/${fullFileName}`,
					type: FacsimileType.Image,
				}]
			}
		})
}) as ExtractFacsimiles

// const path = `http://vangoghletters.org/vg/facsimiles/${fileName}`
