import { ConfigEntry } from '@docere/common'

export default function extractFacsimiles(entry: ConfigEntry) {
	return Array.from(entry.document.querySelectorAll('pb[id]'))
		.map(pb => {
			const imgPath = 'Senato-dispacci-ambasciatori-e-residenti-Signori-Stati-filza-2_' //0271_133-r'
			const pageNumber = parseInt(pb.id.slice(0, 3))
			const rv = pb.id.slice(3)

			let irrelevantNumber = (pageNumber * 2) + 5
			if (rv === 'v') irrelevantNumber += 1
			
			// console.log(pb.id)
			const path = `/iiif/suriano/${imgPath}0${irrelevantNumber}_${pageNumber}-${rv}.jpg/info.json`

			return {
				id: pb.id,
				versions: [{
					path
				}]
			}
		})
		.filter(facs => facs != null)
}
