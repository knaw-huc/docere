import { ExtractFacsimiles } from '@docere/common'

export default (function extractFacsimiles({ layerElement, config }) {
	return Array.from(layerElement.querySelectorAll(config.facsimiles.selector))
		.map(pb => {
			const id = config.facsimiles.extractFacsimileId(pb)
			const imgPath = 'Senato-dispacci-ambasciatori-e-residenti-Signori-Stati-filza-2_' //0271_133-r'

			const pageNumber = parseInt(id.slice(1, 3))
			const rv = id.slice(3)

			let irrelevantNumber = (pageNumber * 2) + 5
			if (rv === 'v') irrelevantNumber += 1
			
			const path = `/iiif/suriano/Senato-dispacci-ambasciatori-e-residenti-Signori-Stati-filza-2/${imgPath}0${irrelevantNumber}_0${pageNumber}-${rv}.jpg/info.json`

			return {
				anchor: pb,
				id,
				// versions: [{
					path
				// }]
			}
		})
		.filter(facs => facs != null)
}) as ExtractFacsimiles
