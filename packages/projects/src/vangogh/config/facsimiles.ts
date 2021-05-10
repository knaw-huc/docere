import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, entry, config }) {
	return Array.from(layerElement.querySelectorAll(config.facsimiles.selector))
		.map(pb => {
			const id = config.facsimiles.extractFacsimileId(pb)
			if (id == null) return
			const graphic = entry.document.querySelector(`zone[*|id="${id}"] graphic[rend="facstab"]`)
			if (graphic == null) return

			const fileName = graphic.getAttribute('url').slice(0, -5)
			// const thumbFileName = fileName.concat('t.jpg')
			const fullFileName = fileName.concat('f.png')

			return {
				anchor: pb,
				id, /* TODO set ID in generic extractor like entities? use docere:id? */
				// versions: [{
				// 	thumbnailPath: `/iiif/vangogh/${thumbFileName}`,
				path: `/iiif/vangogh/${fullFileName}`,
				// 	type: FacsimileType.Image,
				// }]
			}
		})
}) as ExtractFacsimiles

// const path = `http://vangoghletters.org/vg/facsimiles/${fileName}`
