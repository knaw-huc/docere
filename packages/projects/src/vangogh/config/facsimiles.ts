import { FacsimileType, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, entry, config }) {
	return Array.from(entry.document.querySelectorAll(config.facsimiles.selector))
		.map(zone => {
			const id = zone.getAttribute('xml:id')
			const graphic = zone.querySelector('graphic[rend="facstab"]')
			if (graphic == null) return null

			const fileName = graphic.getAttribute('url').slice(0, -5)
			const thumbFileName = fileName.concat('t.jpg')
			const fullFileName = fileName.concat('f.png')

			const anchor = layerElement.querySelector(`pb[facs="#${id}"]`)
			if (anchor == null) return null

			return {
				anchor,
				id, /* TODO set ID in generic extractor like entities? use docere:id? */
				versions: [{
					thumbnailPath: `/iiif/vangogh/${thumbFileName}`,
					path: `/iiif/vangogh/${fullFileName}`,
					type: FacsimileType.Image,
				}]
			}
		})
}) as ExtractFacsimiles

// const path = `http://vangoghletters.org/vg/facsimiles/${fileName}`
