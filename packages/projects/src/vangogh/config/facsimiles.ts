import { FacsimileType, ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, entry }) {
	return Array.from(layerElement.querySelectorAll('pb[facs]'))
		.map(pb => {
			const id = pb.getAttribute('facs')?.slice(1)
			if (id == null) return
			const graphic = entry.document.querySelector(`zone[*|id="${id}"] graphic[rend="facstab"]`)
			if (graphic == null) return

			const fileName = graphic.getAttribute('url').slice(0, -5)
			const thumbFileName = fileName.concat('t.jpg')
			const fullFileName = fileName.concat('f.png')

			return {
				anchor: pb,
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
